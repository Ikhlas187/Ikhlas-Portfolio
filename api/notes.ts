// Notes épinglées partagées entre tous les visiteurs : fonction Vercel (GET liste, POST épingle) sur la base Neon.
// DATABASE_URL vient de Vercel ; imports locaux en .js : la fonction tourne en modules ES sans bundler.
import { createHash, randomUUID } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import { noteRejection } from '../src/logic/notes/moderation/moderation.js'
import { NOTE_COLORS, type NoteColor, type PinnedNote } from '../src/types/note.js'

// Le tableau n'affiche que les plus récentes.
const NOTES_LIMIT = 30
// Anti-spam : au plus 3 notes par minute pour une même adresse (gardée hachée, jamais en clair).
const RATE_LIMIT_COUNT = 3
const RATE_LIMIT_SECONDS = 60

type NoteRow = { id: string; text: string; author: string | null; color: NoteColor; created_at: string | Date; is_mine?: boolean }

// Clé secrète du navigateur du visiteur (lib/visitorToken.ts) : seule son empreinte est gardée, elle désigne sa note.
const VISITOR_TOKEN = /^[0-9a-f-]{36}$/i

const sql = neon(process.env.DATABASE_URL ?? '')

// Schéma à part : les migrations Prisma du backend, limitées à public, ne le voient pas.
let ready: Promise<unknown> | null = null
function ensureTable() {
  ready ??= sql`CREATE SCHEMA IF NOT EXISTS portfolio_notes`.then(
    () => sql`CREATE TABLE IF NOT EXISTS portfolio_notes.pinned_notes (
      id uuid PRIMARY KEY,
      text varchar(100) NOT NULL,
      author varchar(30),
      color varchar(10) NOT NULL,
      ip_hash char(64) NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  )
    .then(() => sql`ALTER TABLE portfolio_notes.pinned_notes ADD COLUMN IF NOT EXISTS owner_hash char(64)`)
    // 1 note par visiteur, garanti par la base même si 2 demandes arrivent en même temps.
    .then(() => sql`CREATE UNIQUE INDEX IF NOT EXISTS pinned_notes_owner ON portfolio_notes.pinned_notes (owner_hash)
      WHERE owner_hash IS NOT NULL`)
  ready.catch(() => {
    ready = null
  })
  return ready
}

function toNote(row: NoteRow): PinnedNote {
  const note: PinnedNote = { id: row.id, text: row.text, author: row.author, color: row.color, createdAt: new Date(row.created_at).toISOString() }
  return row.is_mine ? { ...note, isMine: true } : note
}

function hashOf(value: string) {
  return createHash('sha256').update(`${process.env.NOTES_SALT ?? 'portfolio-notes'}:${value}`).digest('hex')
}

function ownerHash(request: Request) {
  const token = request.headers.get('x-visitor-token') ?? ''
  return VISITOR_TOKEN.test(token) ? hashOf(`visitor:${token}`) : null
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

function ipHash(request: Request) {
  return hashOf(request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown')
}

export async function GET(request: Request) {
  try {
    await ensureTable()
    const owner = ownerHash(request) ?? ''
    // Les plus récentes, plus la note du visiteur si elle est plus ancienne : il doit toujours pouvoir la retirer.
    const rows = (await sql`(SELECT id, text, author, color, created_at, owner_hash = ${owner} AS is_mine
        FROM portfolio_notes.pinned_notes ORDER BY created_at DESC LIMIT ${NOTES_LIMIT})
      UNION
      (SELECT id, text, author, color, created_at, true AS is_mine FROM portfolio_notes.pinned_notes WHERE owner_hash = ${owner})
      ORDER BY created_at DESC`) as NoteRow[]
    return json(rows.map(toNote))
  } catch {
    return json({ error: 'unavailable' }, 503)
  }
}

export async function POST(request: Request) {
  let body: { text?: unknown; author?: unknown; color?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return json({ error: 'empty' }, 400)
  }
  const text = typeof body.text === 'string' ? body.text.trim() : ''
  const author = typeof body.author === 'string' ? body.author.trim() : ''
  const color = NOTE_COLORS.find((noteColor) => noteColor === body.color)
  const rejection = noteRejection(text, author)
  if (rejection || !color) return json({ error: rejection ?? 'empty' }, 400)
  const owner = ownerHash(request)
  if (!owner) return json({ error: 'unavailable' }, 400)

  try {
    await ensureTable()
    const [{ pinned }] = (await sql`SELECT count(*)::int AS pinned FROM portfolio_notes.pinned_notes
      WHERE owner_hash = ${owner}`) as { pinned: number }[]
    if (pinned > 0) return json({ error: 'alreadyPinned' }, 409)
    const hash = ipHash(request)
    const [{ count }] = (await sql`SELECT count(*)::int AS count FROM portfolio_notes.pinned_notes
      WHERE ip_hash = ${hash} AND created_at > now() - make_interval(secs => ${RATE_LIMIT_SECONDS})`) as { count: number }[]
    if (count >= RATE_LIMIT_COUNT) return json({ error: 'tooMany' }, 429)
    const [row] = (await sql`INSERT INTO portfolio_notes.pinned_notes (id, text, author, color, ip_hash, owner_hash)
      VALUES (${randomUUID()}, ${text}, ${author || null}, ${color}, ${hash}, ${owner})
      RETURNING id, text, author, color, created_at, true AS is_mine`) as NoteRow[]
    return json(toNote(row), 201)
  } catch (error) {
    // 23505 : l'index unique a refusé une 2e note du même visiteur.
    if ((error as { code?: string }).code === '23505') return json({ error: 'alreadyPinned' }, 409)
    return json({ error: 'unavailable' }, 503)
  }
}

// Retire une note, seulement si elle appartient au visiteur qui le demande.
export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get('id') ?? ''
  const owner = ownerHash(request)
  if (!owner || !/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'notFound' }, 404)
  try {
    await ensureTable()
    const rows = await sql`DELETE FROM portfolio_notes.pinned_notes WHERE id = ${id} AND owner_hash = ${owner} RETURNING id`
    return rows.length > 0 ? json({ id }) : json({ error: 'notFound' }, 404)
  } catch {
    return json({ error: 'unavailable' }, 503)
  }
}

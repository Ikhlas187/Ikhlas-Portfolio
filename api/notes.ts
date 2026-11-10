// Notes épinglées partagées entre tous les visiteurs : fonction Vercel (GET liste, POST épingle) sur la base Neon.
// DATABASE_URL est une variable d'environnement du projet Vercel, jamais dans le code.
import { createHash, randomUUID } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import { noteRejection } from '../src/logic/notes/moderation/moderation'
import { NOTE_COLORS, type NoteColor, type PinnedNote } from '../src/types/note'

// Le tableau n'affiche que les plus récentes.
const NOTES_LIMIT = 30
// Anti-spam : au plus 3 notes par minute pour une même adresse (gardée hachée, jamais en clair).
const RATE_LIMIT_COUNT = 3
const RATE_LIMIT_SECONDS = 60

type NoteRow = { id: string; text: string; author: string | null; color: NoteColor; created_at: string | Date }

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
  ready.catch(() => {
    ready = null
  })
  return ready
}

function toNote(row: NoteRow): PinnedNote {
  return { id: row.id, text: row.text, author: row.author, color: row.color, createdAt: new Date(row.created_at).toISOString() }
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

function ipHash(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  return createHash('sha256').update(`${process.env.NOTES_SALT ?? 'portfolio-notes'}:${ip}`).digest('hex')
}

export async function GET() {
  try {
    await ensureTable()
    const rows = (await sql`SELECT id, text, author, color, created_at FROM portfolio_notes.pinned_notes
      ORDER BY created_at DESC LIMIT ${NOTES_LIMIT}`) as NoteRow[]
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

  try {
    await ensureTable()
    const hash = ipHash(request)
    const [{ count }] = (await sql`SELECT count(*)::int AS count FROM portfolio_notes.pinned_notes
      WHERE ip_hash = ${hash} AND created_at > now() - make_interval(secs => ${RATE_LIMIT_SECONDS})`) as { count: number }[]
    if (count >= RATE_LIMIT_COUNT) return json({ error: 'tooMany' }, 429)
    const [row] = (await sql`INSERT INTO portfolio_notes.pinned_notes (id, text, author, color, ip_hash)
      VALUES (${randomUUID()}, ${text}, ${author || null}, ${color}, ${hash})
      RETURNING id, text, author, color, created_at`) as NoteRow[]
    return json(toNote(row), 201)
  } catch {
    return json({ error: 'unavailable' }, 503)
  }
}

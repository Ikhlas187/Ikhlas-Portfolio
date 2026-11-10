// Instantané des repos GitHub pour le dossier Projects du Mac : usage dans tools/README.md, section 4.

import { execFile } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)

const OWNER = 'Ikhlas187'
const EXCLUDED_REPOS = new Set(['entourage-plus', OWNER])
// Repos d'équipe publics, hors du compte d'Ikhlas, auxquels il a contribué.
const EXTERNAL_REPOS = [{ owner: 'thelord00229', name: 'ETUDOCS' }]
const REPO_FIELDS = 'name,isFork,isPrivate,isEmpty,diskUsage,homepageUrl,description,primaryLanguage,defaultBranchRef,pushedAt,updatedAt'
const OUT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/repos')
const MAX_FILE_BYTES = 150 * 1024
const MAX_REPO_JSON_BYTES = 4 * 1024 * 1024
const CONCURRENCY = 12

const IGNORED_DIRS = new Set(['node_modules', 'dist', 'build', '.next', 'vendor', '.git', '.vercel', '.turbo', '.cache', 'coverage', '__pycache__', '.gradle', '.idea'])
const LOCKFILES = new Set(['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lockb', 'composer.lock', 'Gemfile.lock', 'poetry.lock', 'Cargo.lock', 'Pipfile.lock', 'uv.lock'])
const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'ico', 'bmp', 'tif', 'tiff', 'heic', 'psd', 'ai', 'sketch', 'fig',
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt',
  'woff', 'woff2', 'ttf', 'otf', 'eot',
  'zip', 'rar', '7z', 'tar', 'gz', 'tgz', 'bz2', 'xz', 'jar', 'war',
  'exe', 'dll', 'so', 'dylib', 'bin', 'o', 'obj', 'a', 'lib', 'class', 'pyc', 'out', 'app', 'msi', 'dmg', 'apk',
  'mp3', 'mp4', 'wav', 'ogg', 'mov', 'avi', 'webm', 'mkv', 'flac', 'm4a',
  'glb', 'gltf', 'fbx', 'blend', 'sqlite', 'db', 'mdb', 'lockb',
])
const MAIN_CODE_EXTENSIONS = new Set([
  'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'py', 'java', 'c', 'cpp', 'cc', 'h', 'hpp', 'cs', 'go', 'rs', 'php', 'rb',
  'kt', 'swift', 'vue', 'svelte', 'html', 'css', 'scss', 'sql', 'sh', 'md',
])

// Noms de fichiers sensibles : jamais publiés, même pas dans l'arbre.
function sensitiveNameReason(filePath) {
  const name = filePath.split('/').pop().toLowerCase()
  if (name.startsWith('.env') && !['.env.example', '.env.sample', '.env.template'].includes(name)) return 'fichier .env'
  if (/\.(pem|key|p12|pfx|keystore|jks)$/.test(name)) return 'clé ou certificat privé'
  if (name.startsWith('id_rsa') || name.startsWith('id_ed25519') || name.startsWith('id_ecdsa')) return 'clé SSH'
  if (name.includes('credential') || /^service-?account.*\.json$/.test(name)) return 'fichier de credentials'
  if (/(^|\/)config\/secrets/i.test(filePath)) return 'config/secrets'
  if (name === '.npmrc' || name === '.pypirc' || name === '.netrc') return 'fichier de jetons de registre'
  return null
}

const SECRET_PATTERNS = [
  ['clé OpenAI/Stripe (sk-)', /\bsk-(?:live_|test_|proj-)?[A-Za-z0-9_-]{20,}/],
  ['clé AWS (AKIA)', /\bAKIA[0-9A-Z]{16}\b/],
  ['jeton GitHub (ghp_)', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}/],
  ['jeton Slack (xox)', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['clé Google (AIza)', /\bAIza[0-9A-Za-z_-]{35}/],
  ['bloc de clé (-----BEGIN)', /-----BEGIN [A-Z ]*(?:PRIVATE KEY|CERTIFICATE)-----/],
  ['chaîne MongoDB (mongodb+srv://)', /mongodb\+srv:\/\/[^\s"'`]+/],
  ['mot de passe en clair (password=)', /password\s*=\s*["'][^"'\s]{2,}["']/i],
  ['jeton npm (_authToken)', /_authToken\s*=\s*\S+/],
]

// Valeur d'une variable dont le nom évoque un secret, hors renvoi à l'environnement et hors valeur bouchon.
const SECRET_ASSIGNMENT = /^\s*(?:export\s+)?([A-Z0-9_]*(?:SECRET|TOKEN|API_KEY|APIKEY|PRIVATE_KEY|PASSWORD|PASSWD|ACCESS_KEY)[A-Z0-9_]*)\s*[=:]\s*["']?([^\s"'#,;]+)/gm
const PLACEHOLDER_VALUE = /^(?:process\.env|import\.meta|os\.environ|os\.getenv|getenv|System\.getenv|env\(|\$\{|\$|<|your|xxx|changeme|change_me|example|placeholder|todo|\*+|\.\.\.|null|none|undefined|""|''|true|false)/i

const CONNECTION_STRING = /(?:postgres(?:ql)?|mysql|mariadb|mongodb|redis|amqp|mssql):\/\/([^\s:@/"'`]+):([^\s@/"'`]+)@([^\s/:"'`]+)/g
const ENV_PASSWORD_LINE = /^\s*(?:export\s+)?[\w.-]*password[\w.-]*\s*=\s*([^\s"'#$]{2,})\s*$/im

// Une chaîne d'exemple (<password>, HOST, user:password@localhost) n'est pas un secret.
function isPlaceholderCredential(user, password, host) {
  const isPlaceholder = (value) => /^(?:<.*>|\$\{.*\}|[A-Z_]+|user(name)?|password|pass|xxx+|changeme|your[\w-]*|\*+)$/i.test(value)
  return isPlaceholder(password) || host.includes('<') || /^[A-Z_]+$/.test(host) || (isPlaceholder(user) && /^(localhost|127\.0\.0\.1|db|postgres|mongo)$/.test(host))
}

function secretReason(text, filePath) {
  for (const [label, pattern] of SECRET_PATTERNS) if (pattern.test(text)) return label
  for (const match of text.matchAll(CONNECTION_STRING)) {
    if (!isPlaceholderCredential(match[1], match[2], match[3])) return 'chaîne de connexion avec mot de passe'
  }
  const isEnvLike = /(^|\/)\.env[^/]*$|\.(properties|ini|cfg|conf|ya?ml|toml)$/i.test(filePath)
  if (isEnvLike) {
    const passwordLine = text.match(ENV_PASSWORD_LINE)
    if (passwordLine && !PLACEHOLDER_VALUE.test(passwordLine[1])) return 'mot de passe en clair (password=)'
    for (const match of text.matchAll(SECRET_ASSIGNMENT)) {
      if (!PLACEHOLDER_VALUE.test(match[2])) return `variable sensible renseignée (${match[1]})`
    }
  }
  return null
}

function extensionOf(filePath) {
  const name = filePath.split('/').pop()
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : ''
}

async function gh(args, asBuffer = false) {
  const { stdout } = await run('gh', args, { maxBuffer: 256 * 1024 * 1024, encoding: asBuffer ? 'buffer' : 'utf8' })
  return stdout
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++
        results[index] = await worker(items[index])
      }
    }),
  )
  return results
}

function decodeText(buffer) {
  if (buffer.includes(0)) return null
  const text = new TextDecoder('utf-8', { fatal: false }).decode(buffer)
  const replaced = (text.match(/�/g) ?? []).length
  return replaced > 8 ? null : text
}

async function snapshotRepo(repo) {
  const branch = repo.defaultBranchRef.name
  const tree = JSON.parse(await gh(['api', `repos/${repo.owner}/${repo.name}/git/trees/${encodeURIComponent(branch)}?recursive=1`]))
  const removedForSecret = []
  const entries = []

  for (const node of tree.tree) {
    if (node.type !== 'blob' && node.type !== 'tree') continue
    const segments = node.path.split('/')
    if (segments.some((segment) => IGNORED_DIRS.has(segment))) continue
    if (node.type === 'tree') {
      entries.push({ path: node.path, type: 'dir' })
      continue
    }
    const nameReason = sensitiveNameReason(node.path)
    if (nameReason) {
      removedForSecret.push({ path: node.path, reason: nameReason })
      continue
    }
    const name = segments.at(-1)
    const entry = { path: node.path, type: 'file', size: node.size, sha: node.sha }
    if (LOCKFILES.has(name)) entry.omitted = 'lockfile'
    else if (BINARY_EXTENSIONS.has(extensionOf(name))) entry.omitted = 'binary'
    else if (node.size > MAX_FILE_BYTES) entry.omitted = 'tooLarge'
    entries.push(entry)
  }

  const toFetch = entries.filter((entry) => entry.type === 'file' && !entry.omitted)
  await mapLimit(toFetch, CONCURRENCY, async (entry) => {
    const raw = await gh(['api', '-H', 'Accept: application/vnd.github.raw', `repos/${repo.owner}/${repo.name}/git/blobs/${entry.sha}`], true)
    const text = decodeText(raw)
    if (text === null) {
      entry.omitted = 'binary'
      return
    }
    const reason = secretReason(text, entry.path)
    if (reason) {
      entry.removed = true
      removedForSecret.push({ path: entry.path, reason })
      return
    }
    entry.content = text
  })

  const kept = entries.filter((entry) => !entry.removed)
  const contentBudgetApplied = applyContentBudget(kept)

  const snapshot = {
    name: repo.name,
    branch,
    contentBudgetApplied,
    treeTruncated: Boolean(tree.truncated),
    entries: kept.map(({ sha, removed, ...rest }) => rest),
  }
  return { snapshot, removedForSecret }
}

// Au-delà du plafond, on garde l'arbre complet mais seulement le contenu des fichiers de code principaux, les plus légers d'abord.
function applyContentBudget(entries) {
  const sizeOf = () => Buffer.byteLength(JSON.stringify(entries.map(({ sha, removed, ...rest }) => rest)))
  if (sizeOf() <= MAX_REPO_JSON_BYTES) return false
  const withContent = entries.filter((entry) => entry.content !== undefined)
  for (const entry of withContent) {
    if (!MAIN_CODE_EXTENSIONS.has(extensionOf(entry.path))) {
      delete entry.content
      entry.omitted = 'budget'
    }
  }
  const mainCode = withContent.filter((entry) => entry.content !== undefined).sort((a, b) => b.content.length - a.content.length)
  let total = sizeOf()
  for (const entry of mainCode) {
    if (total <= MAX_REPO_JSON_BYTES) break
    total -= Buffer.byteLength(JSON.stringify(entry.content))
    delete entry.content
    entry.omitted = 'budget'
  }
  return true
}

async function main() {
  const onlyIndex = process.argv.indexOf('--only')
  const only = onlyIndex === -1 ? null : new Set(process.argv.slice(onlyIndex + 1))
  const ownRepos = JSON.parse(await gh(['repo', 'list', OWNER, '--limit', '100', '--json', REPO_FIELDS])).map((repo) => ({ ...repo, owner: OWNER }))
  const externalRepos = await Promise.all(
    EXTERNAL_REPOS.map(async ({ owner, name }) => ({ ...JSON.parse(await gh(['repo', 'view', `${owner}/${name}`, '--json', REPO_FIELDS])), owner })),
  )
  const repos = [...ownRepos, ...externalRepos].filter((repo) => !only || only.has(repo.name))
  const selected = repos.filter((repo) => !repo.isFork && !repo.isEmpty && repo.diskUsage > 0 && repo.defaultBranchRef && !EXCLUDED_REPOS.has(repo.name))
  const skipped = repos.filter((repo) => !selected.includes(repo)).map((repo) => repo.name)

  // --only : on garde les autres instantanés et les autres lignes de l'index.
  const previousIndex = only ? JSON.parse(await readFile(path.join(OUT_DIR, 'index.json'), 'utf8')) : []
  if (!only) await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_DIR, { recursive: true })

  const index = previousIndex.filter((entry) => !only.has(entry.name))
  const report = []
  for (const repo of selected) {
    process.stdout.write(`${repo.name}… `)
    const { snapshot, removedForSecret } = await snapshotRepo(repo)
    const json = JSON.stringify(snapshot)
    await writeFile(path.join(OUT_DIR, `${repo.name}.json`), json)
    const fileCount = snapshot.entries.filter((entry) => entry.type === 'file').length
    index.push({
      name: repo.name,
      description: repo.description || null,
      language: repo.primaryLanguage?.name ?? null,
      visibility: repo.isPrivate ? 'private' : 'public',
      githubUrl: `https://github.com/${repo.owner}/${repo.name}`,
      homepageUrl: repo.homepageUrl || null,
      branch: snapshot.branch,
      updatedAt: repo.pushedAt || repo.updatedAt,
      fileCount,
    })
    report.push({ repo: repo.name, kb: Math.round(json.length / 1024), fileCount, budget: snapshot.contentBudgetApplied, truncated: snapshot.treeTruncated, removedForSecret })
    console.log(`${fileCount} fichiers, ${Math.round(json.length / 1024)} Ko${snapshot.contentBudgetApplied ? ', plafond appliqué' : ''}`)
  }
  index.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  await writeFile(path.join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2))

  console.log(`\nRepos ignorés : ${skipped.join(', ')}`)
  console.log('\nFichiers retirés pour secret (chemin + type, jamais la valeur) :')
  for (const { repo, removedForSecret } of report) {
    for (const { path: filePath, reason } of removedForSecret) console.log(`  ${repo}/${filePath} : ${reason}`)
  }
  await writeFile(path.join(OUT_DIR, '..', '..', 'tools', 'repos', 'last-report.json'), JSON.stringify({ skipped, report }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

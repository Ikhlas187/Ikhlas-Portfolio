const TOKEN_KEY = 'visitor-token'

let memoryToken: string | null = null

// Clé secrète et aléatoire de ce navigateur : elle désigne la note du visiteur auprès de api/notes.ts.
export function visitorToken() {
  try {
    const saved = window.localStorage.getItem(TOKEN_KEY)
    if (saved) return saved
    const token = crypto.randomUUID()
    window.localStorage.setItem(TOKEN_KEY, token)
    return token
  } catch {
    // Stockage bloqué (navigation privée stricte) : clé en mémoire, valable jusqu'au rechargement.
    memoryToken ??= crypto.randomUUID()
    return memoryToken
  }
}

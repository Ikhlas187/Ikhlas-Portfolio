const SILENCED_KEY = 'call.silenced'

// sessionStorage peut lever une erreur (navigation privée, stockage bloqué) : on retombe sur « sonne encore ».
export function isCallSilenced() {
  try {
    return window.sessionStorage.getItem(SILENCED_KEY) === '1'
  } catch {
    return false
  }
}

export function markCallSilenced() {
  try {
    window.sessionStorage.setItem(SILENCED_KEY, '1')
  } catch {
    return
  }
}

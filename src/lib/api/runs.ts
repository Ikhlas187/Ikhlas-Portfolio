// Programmes WebAssembly de public/runs/ (voir tools/runs/), chargés seulement quand le visiteur lance un projet.

export async function fetchProgramSource(moduleUrl: string) {
  const response = await fetch(moduleUrl)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.text()
}

// Scripts classiques (pas des modules) : ajoutés une seule fois à la page, réutilisés aux lancements suivants.
export function loadScript(src: string) {
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
  if (existing?.dataset.loaded) return Promise.resolve()
  return new Promise<void>((resolve, reject) => {
    const script = existing ?? document.createElement('script')
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true'
      resolve()
    })
    script.addEventListener('error', () => reject(new Error(src)))
    if (!existing) {
      script.src = src
      document.body.append(script)
    }
  })
}

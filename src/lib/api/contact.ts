import { SITE } from '@/data/site'

const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${SITE.email}`

// La 1re soumission déclenche un email d'activation FormSubmit à confirmer une fois.
export async function sendContactMessage(email: string, message: string) {
  const response = await fetch(FORMSUBMIT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email,
      message,
      _subject: 'Contact portfolio',
      _template: 'table',
    }),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
}

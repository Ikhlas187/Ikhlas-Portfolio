import type { BookingMailLabels } from '@/data/footer'

// Lien mailto pré-rempli avec le créneau choisi : {date} et {time} sont remplacés dans le sujet et le corps.
export function bookingMailHref(email: string, labels: BookingMailLabels, date: string, time: string) {
  const fill = (text: string) => text.replace('{date}', date).replace('{time}', time)
  return `mailto:${email}?subject=${encodeURIComponent(fill(labels.subject))}&body=${encodeURIComponent(fill(labels.body))}`
}

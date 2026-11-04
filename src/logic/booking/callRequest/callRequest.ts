// Message envoyé à Ikhlas : la ligne du créneau ({date}, {time}) puis le mot du visiteur.
export function callRequestMessage(template: string, date: string, time: string, message: string) {
  const slotLine = template.replace('{date}', date).replace('{time}', time)
  const note = message.trim()
  return note ? `${slotLine}\n\n${note}` : slotLine
}

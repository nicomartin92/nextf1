export default function dateFormat(dateISO: string) {
  const date = new Date(dateISO)

  const formatted = date.toLocaleString('fr-FR', {
    weekday: 'long', // dimanche
    year: 'numeric', // 2025
    month: 'long', // mars
    day: 'numeric', // 16
    hour: '2-digit', // 05
    minute: '2-digit', // 00
  })
  return formatted
}

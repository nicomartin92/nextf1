'use client'
import { useEffect, useState } from 'react'

type F1Result = {
  position: string
  driver: string
  constructor: string
  time: string
}

export default function F1Results() {
  const [results, setResults] = useState<F1Result[]>([])
  const [raceName, setRaceName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/f1')
        if (!res.ok) throw new Error(`Erreur: ${res.status}`)
        const data = await res.json()

        setRaceName(data.raceName)
        setResults(data.results)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  if (loading) return <p>Chargement...</p>
  if (error) return <p>Erreur : {error}</p>

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{raceName}</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Pos</th>
            <th className="border p-2">Pilote</th>
            <th className="border p-2">Écurie</th>
            <th className="border p-2">Temps</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.position}>
              <td className="border p-2">{r.position}</td>
              <td className="border p-2">{r.driver}</td>
              <td className="border p-2">{r.constructor}</td>
              <td className="border p-2">{r.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

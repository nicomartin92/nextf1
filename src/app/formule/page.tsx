'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Race = {
  round: string
  Circuit: {
    circuitId: string
  }
} 

export default function Page() {

    // const [results, setResults] = useState<F1Result[]>([])
    // const [raceName, setRaceName] = useState<string>('')

    const [racesResults, setRaceResults] = useState<Race[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
      /* const fetchResults = async () => {
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
  
      fetchResults() */

      const fetchRaces = async () => {
        try {
          const res = await fetch('/api/races')
          if (!res.ok) throw new Error(`Erreur: ${res.status}`)
          const data = await res.json()
  
          setRaceResults(data.results)
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue')
        } finally {
          setLoading(false)
        }
      }
  
      fetchRaces()
    }, [])
  
    if (loading) return <p>Chargement...</p>
    if (error) return <p>Erreur : {error}</p>
    
    return (
        <div>   
            <h1>Liste des courses</h1>
            {racesResults.map((r) => (
                <div key={r.round} className="flex flex-row gap-2">
                    <div>round: {r.round}</div>
                    <div>circuitId: {r.Circuit.circuitId}</div>
                    <Link href={`/formule/${r.Circuit.circuitId}`}>{r.Circuit.circuitId}</Link>
                </div>
            ))}
        </div>
    )
  }
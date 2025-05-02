'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '../formule/formule.module.css'

type Race = {
    country_name: string
    date_start: string
    session_key: string
} 

export default function Page() {
    const [racesResults, setRaceResults] = useState<Race[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
      const fetchRaces = async () => {
        try {
          const res = await fetch('/api/races2025')
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
            <h1>Liste des grand prix 2025</h1>
            {racesResults.map((r) => (
                <div key={r.session_key} className={styles.item}>
                    <div>{r.country_name}</div>
                    <div>{r.date_start}</div>
                    <Link href={`/session/${r.session_key}?grand_prix=${r.country_name}&date=${r.date_start}`}>Voir les résultats</Link>
                </div>
            ))}
        </div>
    )
  }
'use client'
import { useEffect, useState } from 'react'
import { use } from 'react'
import styles from '../formule.module.css'
import { cars } from '@/data/cars'
import Image from 'next/image'

interface PageProps {
  params: Promise<{
    circuitId: string;
  }>
}

type Circuit = {
  circuitId: string
  position: string
  points: string
  Driver: {
    driverId: string
    givenName: string
    familyName: string
  }
  FastestLap?: {
    Time: {
      time: string
    }
  }
  Constructor: {
    constructorId: string
  }
} 

export default function CircuitPage({ params }: PageProps) {
    const { circuitId } = use(params);
    const [id, round] = circuitId.split('%26')
    const [roundName, roundId] = round.split('%3D')

    const [circuitResults, setCircuitResults] = useState<Circuit[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {  
      const fetchRaces = async () => {
        try {
          const res = await fetch(`/api/circuit/${id}`)
          if (!res.ok) throw new Error(`Erreur: ${res.status}`)
          const data = await res.json()
  
          setCircuitResults(data.winners)
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue sur circuit API')
        } finally {
          setLoading(false)
        }
      }
  
      fetchRaces()
    }, [id])
  
    if (loading) return <p>Chargement...</p>
    if (error) return <p>Erreur : {error}</p>

    return (
        <div>
            <h1>Circuit {id}</h1>
            <div>{roundName} {roundId}</div>
            {circuitResults.map((r) => (
                <div key={r.Driver.driverId} className={styles.item}> 
                    <div>{r.Driver.givenName} {r.Driver.familyName}</div>
                    <div>{r.position}</div>
                    <div>{r.points} points</div>
                    {r.FastestLap && (
                        <div>Meilleur tour :{r.FastestLap.Time.time}</div>
                    )}
                    <Image 
                        src={cars.find((c) => c.name.toLowerCase() === r.Constructor.constructorId.toLowerCase())?.image || ''} 
                        alt="" 
                        width={250}
                        height={70}
                    />
                </div>
            ))}
        </div>
    )
}
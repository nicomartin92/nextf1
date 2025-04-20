'use client'
import { useEffect, useState, useCallback, use } from 'react'

import Image from 'next/image'
import { races } from '@/data/races'
import RaceResult from '@/app/components/race/raceResult'
import ErrorMessage from '@/app/components/fetchComponents/error'
import LoadingSpinner from '@/app/components/fetchComponents/loading'

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
  status: string
} 

export default function CircuitPage({ params }: PageProps) {
  const { circuitId } = use(params)
  const [id] = circuitId.split('%26')
  const [circuitResults, setCircuitResults] = useState<Circuit[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRaces = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/circuit/${id}`)
      if (!res.ok) {
        throw new Error(`Erreur lors de la récupération des données: ${res.status}`)
      }
      const data = await res.json()
      setCircuitResults(data.winners)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Une erreur inconnue  /api/circuit/${id}`)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {  
    fetchRaces()
  }, [fetchRaces])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  const circuitImage = races.find((c) => c.name.toLowerCase() === id.toLowerCase())?.image

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Circuit {id} 2024</h1>
      
      <div className="mb-8">
        <div className="mx-auto w-fit">
          {circuitImage && (
            <Image 
              src={circuitImage} 
              alt={`Circuit ${id}`}
              width={300}
              height={150}
              className="rounded-lg shadow-lg"
            />
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {circuitResults.map((result) => (
          <RaceResult key={result.Driver.driverId} result={result} />
        ))}
      </div>
    </div>
  )
}
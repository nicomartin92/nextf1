'use client'
import { useEffect, useState, useCallback, use } from 'react'
import Image from 'next/image'
import ErrorMessage from '@/app/components/fetchComponents/error'
import LoadingSpinner from '@/app/components/fetchComponents/loading'
import { races } from '@/data/races'

interface PageProps {
  params: Promise<{
    sessionId: string;
  }>
}

type Pilote = {
  position: number
  driver_number: number
  name: string
}

type RaceInfo = {
  location: string
  country_name: string
  circuit_short_name: string
}

type SessionResults = {
  pilotes: Pilote[]
  raceInfo: RaceInfo
}

export default function CircuitPage({ params }: PageProps) {
  const { sessionId } = use(params)
  const [sessionResults, setSessionResults] = useState<SessionResults>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRaces = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/session/${sessionId}`)
      if (!res.ok) {
        throw new Error(`Erreur lors de la récupération des données: ${res.status}`)
      }
      const data = await res.json()
      setSessionResults(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Une erreur inconnue  /api/session/${sessionId}`)
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {  
    fetchRaces()
  }, [fetchRaces])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  const { location, country_name, circuit_short_name } = sessionResults?.raceInfo || {}

  const circuitImage = races.find((c) => c.name.toLowerCase() === country_name?.toLowerCase())?.image

  console.log('circuitImage', country_name)

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Circuit {circuit_short_name} 2025</h1>
      <p className="text-center">({location}, {country_name})</p>
      <div className="mb-8">
        <div className="mx-auto w-fit">
          <Image
            src={circuitImage || ''} 
            alt={`circuit_short_name car`}
            width={350}
            height={200}
            className="object-contain"
          />
        </div>
      </div>

      <div>
        <h2>Classement :</h2>
        {sessionResults?.pilotes.map((result) => (
          <div key={result.driver_number} className="flex items-center justify-center">
            <p>{result.name}&nbsp;</p>
            <p>n° {result.position}&nbsp;</p>
            <p>(#{result.driver_number})</p>
          </div>
        ))}
      </div>
    </div>
  )
}
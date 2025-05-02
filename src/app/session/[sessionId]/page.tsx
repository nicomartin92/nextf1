'use client'
import { useEffect, useState, useCallback, use } from 'react'
import ErrorMessage from '@/app/components/fetchComponents/error'
import LoadingSpinner from '@/app/components/fetchComponents/loading'

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

export default function CircuitPage({ params }: PageProps) {
  const { sessionId } = use(params)
  const [sessionResults, setSessionResults] = useState<Pilote[]>([])
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
      setSessionResults(data.pilotes)
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

  // const circuitImage = races.find((c) => c.name.toLowerCase() === sessionId.toLowerCase())?.image

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Circuit {sessionId} 2025</h1>
      
      <div className="mb-8">
        <div className="mx-auto w-fit">
          
        </div>
      </div>

      <div>
        {sessionResults.map((result) => (
          <div key={result.driver_number} className="flex items-center justify-center">
            <p>{result.name}</p>
            <p>{result.position}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
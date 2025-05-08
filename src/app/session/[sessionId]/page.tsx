'use client'
import { use } from 'react'
import Image from 'next/image'
import ErrorMessage from '@/app/components/fetchComponents/error'
import LoadingSpinner from '@/app/components/fetchComponents/loading'
import { races } from '@/data/races'
import { cars } from '@/data/cars'
import useSWR from 'swr'

interface PageProps {
  params: Promise<{
    sessionId: string
  }>
}

type Pilote = {
  position: number
  driver_number: number
  name: string
  team_name: string
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

  const {
    data: sessionResults,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<SessionResults>(
    `/api/session/${sessionId}`,
    async (url: string) => {
      console.log('🔄 Fetching data from API...')
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Erreur lors de la récupération des données: ${res.status}`)
      }
      const data = await res.json()
      console.log('✅ Data received from API')
      return data
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      onSuccess: () => {
        console.log('🎉 Cache updated successfully')
      },
      onError: err => {
        console.error('❌ Error updating cache:', err)
      },
    }
  )

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  const { location, country_name, circuit_short_name } = sessionResults?.raceInfo || {}

  const circuitImage = races.find(c => c.name.toLowerCase() === country_name?.toLowerCase())?.image

  console.log('circuitImage', country_name)

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Circuit {circuit_short_name} 2025</h1>
        <div className="flex items-center gap-2">
          {isValidating && <span className="text-sm text-gray-500">Revalidation en cours...</span>}
          <button
            onClick={() => mutate()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Rafraîchir
          </button>
        </div>
      </div>
      <p className="text-center">
        ({location}, {country_name})
      </p>
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
        {sessionResults?.pilotes.map((result: Pilote) => (
          <div key={result.driver_number} className="flex items-center justify-between">
            <p>{result.name}&nbsp;</p>
            <p>n° {result.position}&nbsp;</p>
            <p>(#{result.driver_number})</p>
            {result.team_name}
            <Image
              src={
                cars.find(c => c.name.toLowerCase() === result?.team_name.toLowerCase())?.image ||
                ''
              }
              alt={`${result.team_name} car`}
              width={100}
              height={30}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

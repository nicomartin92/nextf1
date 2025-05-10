'use client'

import { use, Suspense } from 'react'
import { races } from '@/data/races'
import Image from 'next/image'
import ErrorMessage from '@/app/components/fetchComponents/error'
import LoadingSpinner from '@/app/components/fetchComponents/loading'
import IconsLucide from '@/app/components/buttons/icons'
import { motion } from 'framer-motion'

import useSWR from 'swr'
import { usePiloteStore } from '@/lib/store/piloteWhishList'
import { Star } from 'lucide-react'
import { Pilote, SessionResults } from '@/types/session'
import CardPilote from '@/app/components/cards/cardPilote'

interface PageProps {
  params: Promise<{
    sessionId: string
  }>
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

  // store pilotes
  const pilotes = usePiloteStore(state => state.pilotes)
  const setPilotes = usePiloteStore(state => state.setPilotes)

  function handlePiloteClick(pilote: Pilote) {
    if (!pilotes.includes(pilote)) {
      setPilotes([...pilotes, pilote])
      // Sauvegarder dans localStorage
      localStorage.setItem('favoritePilotes', JSON.stringify([...pilotes, pilote]))
    } else {
      setPilotes(pilotes.filter(p => p !== pilote))
      // Mettre à jour localStorage
      localStorage.setItem('favoritePilotes', JSON.stringify(pilotes.filter(p => p !== pilote)))
    }
  }

  console.log('pilotes store', pilotes)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  const { location, country_name, circuit_short_name } = sessionResults?.raceInfo || {}
  const circuitImage = races.find(c => c.name.toLowerCase() === country_name?.toLowerCase())?.image

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4"
    >
      <div className="flex justify-between items-center mb-4">
        <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }} className="text-3xl font-bold">
          Circuit {circuit_short_name} 2025
        </motion.h1>
        <div className="flex items-center gap-2">
          {isValidating && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500"
            >
              Revalidation en cours...
            </motion.span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => mutate()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Rafraîchir
          </motion.button>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          ({location}, {country_name})
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="mx-auto w-fit">
            <Image
              src={circuitImage || ''}
              alt={`circuit_short_name car`}
              width={350}
              height={200}
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h2>Classement :</h2>
          {sessionResults?.pilotes.map((result: Pilote, index: number) => (
            <motion.ul
              key={result.driver_number}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <CardPilote {...result} />
              <IconsLucide
                onClick={() => handlePiloteClick(result)}
                icon={Star}
                isSelected={pilotes.includes(result)}
              />
            </motion.ul>
          ))}
        </motion.div>
      </Suspense>
    </motion.div>
  )
}

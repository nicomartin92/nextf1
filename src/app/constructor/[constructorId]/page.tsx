'use client'
import Card from "@/app/components/cards/card";
import ErrorMessage from "@/app/components/fetchComponents/error";
import LoadingSpinner from "@/app/components/fetchComponents/loading";
import { use, useEffect, useState, useCallback } from "react";
import { cars } from '@/data/cars'
import Image from 'next/image'

interface PageProps {
    params: Promise<{
        constructorId: string;
    }>
}

type Constructor = {
    id: string
    name: string
    nationality: string
} 

export default function ConstructorPage({ params }: PageProps) {

    const { constructorId } = use(params)
    const [constructorResults, setConstructorResults] = useState<Constructor>({ id: '', name: '', nationality: '' })

    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchConstructor = useCallback(async () => {
        try {
          setLoading(true)
          const res = await fetch(`/api/constructor/${constructorId}`)
          if (!res.ok) {
            throw new Error(`Erreur lors de la récupération des données: ${res.status}`)
          }
          const data = await res.json()
          setConstructorResults(data.constructor)

          console.log(data.constructor)
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : `Une erreur inconnue  /api/constructor/${constructorId}`)
        } finally {
          setLoading(false)
        }
      }, [constructorId])
    
      useEffect(() => {  
        fetchConstructor()
      }, [fetchConstructor])

      if (loading) return <LoadingSpinner />
      if (error) return <ErrorMessage message={error} />

      console.log(constructorResults)

    return (
        <div>
            <h1>Constructor</h1>

            <div className="grid gap-4">
                <Card result={constructorResults}>
                    <Image 
                        src={cars.find((c) => c.name.toLowerCase() === constructorResults.id.toLowerCase())?.image || ''} 
                        alt={`${constructorResults.name} car`}
                        width={300}
                        height={100}
                        className="object-contain"
                    />
                </Card>
            </div>
        </div>
    )
}
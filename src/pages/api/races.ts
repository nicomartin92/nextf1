import type { NextApiRequest, NextApiResponse } from 'next'

type Race = {
  raceName: string
  round: string
  Circuit: {
    circuitId: string
    circuitName: string
  }
  date: string
  time: string
}

type RaceTable = {
  Races: Race[]
}

type MRData = {
  RaceTable: RaceTable
}

type ResponseData = {
  MRData: MRData
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch('https://ergast.com/api/f1/2024.json')
    
    if (!response.ok) {
      throw new Error(`Ergast API error: ${response.status}`)
    }

    const data: ResponseData = await response.json()

    const races = data?.MRData?.RaceTable?.Races || []

    res.status(200).json(
        { 
            results: races 
        }
    )
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong' })
  }
}
import type { NextApiRequest, NextApiResponse } from 'next'
import data from '../../data/local/races2024.json'

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
    let races = []
    
    // Use local data first
    if (data && data.MRData && data.MRData.RaceTable && data.MRData.RaceTable.Races) {
      races = data.MRData.RaceTable.Races
    } else {
      // If local data doesn't exist, fetch from API
      const response = await fetch('https://ergast.com/api/f1/2024.json')
      
      if (!response.ok) {
        throw new Error(`Ergast API error: ${response.status}`)
      }

      const apiData: ResponseData = await response.json()
      races = apiData?.MRData?.RaceTable?.Races || []
    }

    res.status(200).json(
        { 
            results: races 
        }
    )
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong' })
  }
}
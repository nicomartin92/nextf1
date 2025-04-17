

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch('https://ergast.com/api/f1/2024.json')
    
    if (!response.ok) {
      throw new Error(`Ergast API error: ${response.status}`)
    }

    const data = await response.json()

    const races = data?.MRData?.RaceTable?.Races || []

    res.status(200).json(
        { 
            results: races 
        }
    )
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Something went wrong' })
  }
}
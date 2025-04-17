// pages/api/f1.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch('https://ergast.com/api/f1/2008/5/results.json')
    
    if (!response.ok) {
      throw new Error(`Ergast API error: ${response.status}`)
    }

    const data = await response.json()

    const races = data?.MRData?.RaceTable?.Races || []
    const results = races[0]?.Results?.map((r: any) => ({
    position: r.position,
    driver: `${r.Driver.givenName} ${r.Driver.familyName}`,
    constructor: r.Constructor.name,
    time: r.Time?.time || 'N/A',
    })) || []

    res.status(200).json({ raceName: races[0]?.raceName, results })
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Something went wrong' })
  }
}

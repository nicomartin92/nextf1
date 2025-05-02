import type { NextApiRequest, NextApiResponse } from 'next'

type RaceResponse = Array<{
    country_name: string
    date_start: string
    session_key: string
}>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let races = []
    
    const response = await fetch('https://api.openf1.org/v1/sessions?year=2025&session_type=Race')
      
    if (!response.ok) {
    throw new Error(`Ergast API error: ${response.status}`)
    }

    const apiData: RaceResponse = await response.json()
    races = apiData || []

    const results = races.map((race) => {
        return {
            country_name: race.country_name,
            date_start: race.date_start,
            session_key: race.session_key
        }
    })

    res.status(200).json(
        { 
            results,
        }
    )
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong' })
  }
}
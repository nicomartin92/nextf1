import type { NextApiRequest, NextApiResponse } from 'next'

type Race = {
  Circuit: {
    circuitId: string
  }
  round: string
}

type RaceTable = {
  Races: Race[]
}

type MRData = {
  RaceTable: RaceTable
}

type Results = {
  MRData: MRData
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const circuitId = getRouterParam(event, 'circuitId')

    const circuitId = 2
  
    const allResults = await fetch('https://ergast.com/api/f1/2024.json')
  
    if (!allResults.ok) {
        throw new Error(`Ergast API error: ${allResults.status}`)
    }
    const results: Results = await allResults.json()
  
    // get parameter from url
    const round = results.MRData.RaceTable.Races.filter((race: Race) => {
      return race.Circuit.circuitId === circuitId.toString()
    })[0].round
  
    /* ------------------------------ */

    const allwinners = await fetch(`https://ergast.com/api/f1/2024/${round}/results.json`)
  
    if (!allwinners.ok) {
      throw new Error(`Ergast API error: ${allwinners.status}`)
    }
    const winners = await allwinners.json()

    res.status(200).json(
        {
            circuitId,
            round,
            winners: winners.MRData.RaceTable.Races[0].Results,
          }
    )
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong' })
  }
}

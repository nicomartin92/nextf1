// pages/api/f1.ts

import type { NextApiRequest, NextApiResponse } from 'next'

type Driver = {
  givenName: string
  familyName: string
}

type Constructor = {
  name: string
}

type Time = {
  time: string
}

type Result = {
  position: string
  Driver: Driver
  Constructor: Constructor
  Time?: Time
}

type Race = {
  raceName: string
  Results: Result[]
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://ergast.com/api/f1/2008/5/results.json')

    if (!response.ok) {
      throw new Error(`Ergast API error: ${response.status}`)
    }

    const data: ResponseData = await response.json()

    const races = data?.MRData?.RaceTable?.Races || []
    const results =
      races[0]?.Results?.map((r: Result) => ({
        position: r.position,
        driver: `${r.Driver.givenName} ${r.Driver.familyName}`,
        constructor: r.Constructor.name,
        time: r.Time?.time || 'N/A',
      })) || []

    res.status(200).json({ raceName: races[0]?.raceName, results })
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong' })
  }
}

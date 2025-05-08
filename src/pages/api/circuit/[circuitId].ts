import type { NextApiRequest, NextApiResponse } from 'next'
import data from '../../../data/local/races2024.json'
import fs from 'fs'

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const circuitId = req.query.circuitId

    const results: Results = data

    // get parameter from url
    const round = results.MRData.RaceTable.Races.filter((race: Race) => {
      return race.Circuit.circuitId === circuitId
    })[0]?.round

    /* ------------------------------ */

    let winnersData = []

    try {
      // Import dynamique du fichier de course
      const raceData = await import(`../../../data/local/winners/races-${round}.json`)
      winnersData = raceData.default
    } catch (error) {
      // Si le fichier local n'existe pas, on fetch depuis l'API
      const allwinners = await fetch(`https://ergast.com/api/f1/2024/${round}/results.json`)

      if (!allwinners.ok) {
        throw new Error(`Failed to fetch all winners: ${allwinners.status}`)
      }
      winnersData = await allwinners.json()

      const content = JSON.stringify(winnersData, null, 2)
      fs.writeFile(`./src/data/local/winners/races-${round}.json`, content, err => {
        if (err) {
          console.error("Erreur d'écriture:", err)
          return
        }
        console.log('Fichier écrit avec succès')
      })

      console.log(error)
    }

    res.status(200).json({
      circuitId,
      round,
      winners: winnersData.MRData.RaceTable.Races[0].Results,
    })
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong' })
  }
}

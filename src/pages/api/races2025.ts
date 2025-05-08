import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

type RaceResponse = Array<{
  country_name: string
  date_start: string
  session_key: string
}>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let races = []
    let hasChanges = false

    try {
      const raceData = await import('../../data/local/races2025.json')
      races = raceData.default

      // Fetch remote data to compare
      const response = await fetch('https://api.openf1.org/v1/sessions?year=2025&session_type=Race')

      if (!response.ok) {
        throw new Error(`Ergast API error: ${response.status}`)
      }

      const apiData: RaceResponse = await response.json()

      // Compare local and remote data
      const localDataStr = JSON.stringify(
        races.sort((a, b) => String(a.session_key).localeCompare(String(b.session_key)))
      )
      const remoteDataStr = JSON.stringify(
        apiData.sort((a, b) => String(a.session_key).localeCompare(String(b.session_key)))
      )

      hasChanges = localDataStr !== remoteDataStr

      if (hasChanges) {
        console.log('Changes detected in remote data, updating local file')
        races = apiData
        const content = JSON.stringify(apiData, null, 2)
        fs.writeFile(`./src/data/local/races2025.json`, content, err => {
          if (err) {
            console.error("Erreur d'écriture:", err)
            return
          }
          console.log('Fichier mis à jour avec succès')
        })
      } else {
        console.log('No changes detected in remote data')
      }
    } catch {
      // If local file doesn't exist or there's an error, fetch from API
      const response = await fetch('https://api.openf1.org/v1/sessions?year=2025&session_type=Race')

      if (!response.ok) {
        throw new Error(`Ergast API error: ${response.status}`)
      }

      const apiData: RaceResponse = await response.json()
      races = apiData || []
      hasChanges = true

      const content = JSON.stringify(apiData, null, 2)
      fs.writeFile(`./src/data/local/races2025.json`, content, err => {
        if (err) {
          console.error("Erreur d'écriture:", err)
          return
        }
        console.log('Fichier écrit avec succès')
      })
    }

    const results = races
      .sort((a, b) => String(a.date_start).localeCompare(String(b.date_start)))
      .map(race => {
        return {
          country_name: race.country_name,
          date_start: race.date_start,
          session_key: race.session_key,
        }
      })

    res.status(200).json({
      results,
      hasChanges,
    })
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong' })
  }
}

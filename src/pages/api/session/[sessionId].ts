import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

type RaceResponse = Array<{
    driver_number: number
    lap_number: number
    position: number
}>

type Driver = {
    driver_number: number
    full_name: string
    team_name: string
}

type Pilote = {
    position: number
    driver_number: number
    name: string
    
}

type Position = {
    position: number
    driver_number: number
    lap_number: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let pilotes: Pilote[] = []
    const sessionId = req.query.sessionId

    // global race data
    const raceData = await import('../../../data/local/races2025.json')
    const races = raceData.default

    const raceInfo = {
        location: races.find((race) => race.session_key === Number(sessionId))?.location,
        country_name: races.find((race) => race.session_key === Number(sessionId))?.country_name,
        circuit_short_name: races.find((race) => race.session_key === Number(sessionId))?.circuit_short_name,
    }

    try {
        // Import dynamique du fichier de course
        const piloteData = await import(`../../../data/local/sessions/session-${sessionId}.json`)
        pilotes = piloteData.default
    } catch (error) {
        let races = []
        const response = await fetch(`https://api.openf1.org/v1/position?session_key=${sessionId}`)
          
        if (!response.ok) {
        throw new Error(`Ergast API error: ${response.status}`)
        }
    
        const apiData: RaceResponse = await response.json()
        races = apiData || []
    
        // keep last position for each driver_number
        const latestPositionPerDriver: Record<number, Position> = {};
        for (const entry of races) {
            const { driver_number, lap_number } = entry;
            
            if (
                !latestPositionPerDriver[driver_number] ||
                lap_number > latestPositionPerDriver[driver_number].lap_number
            ) {
                latestPositionPerDriver[driver_number] = entry;
            }
        }
    
        // convert to array and sort by position
        const finalPositions = Object.values(latestPositionPerDriver).sort(
            (a, b) => a.position - b.position
        );
    
        // get drivers names
        const driversRes = await fetch('https://api.openf1.org/v1/drivers');
        const drivers: Driver[] = await driversRes.json();
    
        // associate names to results
        pilotes = finalPositions
        .filter((pos) => {
            const driver = drivers.find((d) => d.driver_number === pos.driver_number);
            return driver?.team_name !== null
           }).map((pos) => {
            const driver = drivers.find((d) => d.driver_number === pos.driver_number);
    
            return {
                position: pos.position,
                driver_number: pos.driver_number,
                name: driver?.full_name || "Nom inconnu",
                team_name: driver?.team_name || "Equipe inconnue",
            };
        });

        const content = JSON.stringify(pilotes, null, 2)
        fs.writeFile(`./src/data/local/sessions/session-${sessionId}.json`, content, (err) => {
            if (err) {
                console.error('Erreur d\'écriture:', err)
                return
            }
            console.log('Fichier écrit avec succès')
        })

        console.log(error)
    }

    res.status(200).json(
        {
            pilotes,
            raceInfo,
        }
    )
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong' })
  }
}
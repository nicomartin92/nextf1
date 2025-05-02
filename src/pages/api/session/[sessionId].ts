import type { NextApiRequest, NextApiResponse } from 'next'

type RaceResponse = Array<{
    driver_number: number
    lap_number: number
    position: number
}>

type Driver = {
    driver_number: number
    full_name: string
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
    let races = []
    const sessionId = req.query.sessionId
    const response = await fetch(`https://api.openf1.org/v1/position?session_key=${sessionId}`)
      
    if (!response.ok) {
    throw new Error(`Ergast API error: ${response.status}`)
    }

    const apiData: RaceResponse = await response.json()
    races = apiData || []

    console.log(response)

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
    const results2 = finalPositions.map((pos) => {
        const driver = drivers.find((d) => d.driver_number === pos.driver_number);

        return {
            position: pos.position,
            driver_number: pos.driver_number,
            name: driver?.full_name || "Nom inconnu",
        };
    });

    const pilotes: Pilote[] = results2;

    res.status(200).json(
        {
            pilotes,
        }
    )
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong' })
  }
}
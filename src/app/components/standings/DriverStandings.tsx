import { promises as fs } from 'fs'
import path from 'path'

type DriverStanding = {
  driverId: string
  givenName: string
  familyName: string
  constructor: string
  totalPoints: number
  positions: number[]
}

type RaceResult = {
  Driver: {
    driverId: string
    givenName: string
    familyName: string
  }
  Constructor: {
    name: string
  }
  points: string
  position: string
}

async function getDriverStandings(): Promise<DriverStanding[]> {
  // go to winners folder
  const racesDir = path.join(process.cwd(), 'src/data/local/winners')
  const raceFiles = (await fs.readdir(racesDir))
    .filter(file => file.endsWith('.json'))
  
  // read all files in winners folder
  const allResults = await Promise.all(
    raceFiles.map(async file => {
      const content = await fs.readFile(path.join(racesDir, file), 'utf-8')
      const raceData = JSON.parse(content)
      return (raceData.MRData.RaceTable.Races[0]?.Results || []) as RaceResult[]
    })
  ).then(results => results.flat())
  
  // combine all results in one array
  const driverStandings = allResults.reduce<Map<string, DriverStanding>>((standings, result) => {
    const driverId = result.Driver.driverId
    const points = parseInt(result.points) || 0
    
    if (!standings.has(driverId)) {
      standings.set(driverId, {
        driverId,
        givenName: result.Driver.givenName,
        familyName: result.Driver.familyName,
        constructor: result.Constructor.name,
        totalPoints: 0,
        positions: []
      })
    }
    
    const standing = standings.get(driverId)!
    standing.totalPoints += points
    standing.positions.push(parseInt(result.position))
    
    return standings
  }, new Map<string, DriverStanding>())
  
  return Array.from(driverStandings.values())
    .sort((a: DriverStanding, b: DriverStanding) => b.totalPoints - a.totalPoints)
}

export default async function DriverStandings() {
  const standings = await getDriverStandings()
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Classement des Pilotes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Position</th>
              <th className="px-4 py-2 border">Pilote</th>
              <th className="px-4 py-2 border">Écurie</th>
              <th className="px-4 py-2 border">Points</th>
              <th className="px-4 py-2 border">Meilleure Position</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, index) => (
              <tr key={standing.driverId} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border">
                  {standing.givenName} {standing.familyName}
                </td>
                <td className="px-4 py-2 border">{standing.constructor}</td>
                <td className="px-4 py-2 border text-center">{standing.totalPoints}</td>
                <td className="px-4 py-2 border text-center">
                  {Math.min(...standing.positions)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 
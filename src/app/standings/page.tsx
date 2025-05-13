import DriverStandings from '../components/standings/DriverStandings'

export default function StandingsPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Classement de la Saison</h1>
      <DriverStandings />
    </main>
  )
} 
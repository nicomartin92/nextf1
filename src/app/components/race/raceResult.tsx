import Image from 'next/image'
import styles from './RaceResult.module.css'
import { cars } from '@/data/cars'


type Circuit = {
    circuitId: string
    position: string
    points: string
    Driver: {
      driverId: string
      givenName: string
      familyName: string
    }
    FastestLap?: {
      Time: {
        time: string
      }
    }
    Constructor: {
      constructorId: string
    }
    status: string
  } 

// Composant de résultat de course
const RaceResult = ({ result }: { result: Circuit }) => {
    return (
        <div key={result.Driver.driverId} className={`${styles.item} ${result.status === 'retired' ? styles.retired : ''}`}>
        <div className="font-bold">{result.Driver.givenName} {result.Driver.familyName}</div>
        <div className="text-lg font-semibold">P{result.position}</div>
        <div className="space-y-2">
            <div className="text-blue-600">{result.points} points</div>
            {result.FastestLap && (
            <div className="text-sm text-gray-600">
                <div>Meilleur tour :</div>
                <div className="font-mono">{result.FastestLap.Time.time}</div>
            </div>
            )}
        </div>
        <Image 
            src={cars.find((c) => c.name.toLowerCase() === result.Constructor.constructorId.toLowerCase())?.image || ''} 
            alt={`${result.Constructor.constructorId} car`}
            width={100}
            height={30}
            className="object-contain"
        />
        </div>
    )
}

export default RaceResult
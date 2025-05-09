import { cars } from '@/data/cars'
import { Pilote } from '@/types/session'
import Image from 'next/image'

export default function CardPilote(result: Pilote) {
  return (
    <li key={result.driver_number} className="flex items-center justify-between w-full">
      <p>{result.name}&nbsp;</p>
      <p>n° {result.position}&nbsp;</p>
      <p>(#{result.driver_number})</p>
      {result.team_name}
      <Image
        src={cars.find(c => c.name.toLowerCase() === result?.team_name.toLowerCase())?.image || ''}
        alt={`${result.team_name} car`}
        width={100}
        height={30}
        className="object-contain"
      />
    </li>
  )
}

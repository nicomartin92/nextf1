'use client'
import { usePiloteStore } from '@/lib/store/piloteWhishList'
import CardPilote from './components/cards/cardPilote'

export default function Page() {
  const pilotes = usePiloteStore(state => state.pilotes)

  return (
    <div className="HomePage">
      <h1>Saison Formule 1 2025</h1>
      {pilotes.length > 0 && (
        <div>
          <h2>Voir mes pilotes favoris</h2>
          {pilotes.map(pilote => (
            <ul className="flex items-center justify-between" key={pilote.driver_number}>
              <CardPilote key={pilote.driver_number} {...pilote} />
            </ul>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'
import { usePiloteStore } from '@/lib/store/piloteWhishList'

export default function Page() {
  const pilotes = usePiloteStore(state => state.pilotes)

  return (
    <div className="HomePage">
      <h1>Saison Formule 1 2025</h1>
      {pilotes.length > 0 && (
        <div>
          <h2>Voir mes pilotes favoris</h2>
          <ul>
            {pilotes.map(pilote => (
              <li key={pilote}>{pilote}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

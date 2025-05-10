'use client'
import { usePiloteStore } from '@/lib/store/piloteWhishList'
import CardPilote from './components/cards/cardPilote'
import { motion } from 'framer-motion'

export default function Page() {
  const pilotes = usePiloteStore(state => state.pilotes)

  return (
    <div className="HomePage">
      <h1>Saison Formule 1 2025</h1>
      {pilotes.length > 0 && (
        <div>
          <h2>Voir mes pilotes favoris</h2>
          {pilotes.map((pilote, index) => (
            <motion.ul
              key={pilote.driver_number}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <CardPilote key={pilote.driver_number} {...pilote} />
            </motion.ul>
          ))}
        </div>
      )}
    </div>
  )
}

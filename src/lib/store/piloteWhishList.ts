import { Pilote } from '@/types/session'
import { create } from 'zustand'

interface PiloteState {
  pilotes: Pilote[]
  setPilotes: (pilotes: Pilote[]) => void
}

export const usePiloteStore = create<PiloteState>(set => ({
  pilotes: [],
  setPilotes: pilotes => set({ pilotes }),
}))

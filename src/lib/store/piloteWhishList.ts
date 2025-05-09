import { create } from 'zustand'

interface PiloteState {
  pilotes: string[]
  setPilotes: (pilotes: string[]) => void
}

export const usePiloteStore = create<PiloteState>(set => ({
  pilotes: [],
  setPilotes: pilotes => set({ pilotes }),
}))

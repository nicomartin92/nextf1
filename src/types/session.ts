export type Pilote = {
  position: number
  driver_number: number
  name: string
  team_name: string
}

export type RaceInfo = {
  location: string
  country_name: string
  circuit_short_name: string
}

export type SessionResults = {
  pilotes: Pilote[]
  raceInfo: RaceInfo
}

export type Race = {
  country_name: string
  date_start: string
  session_key: string
}

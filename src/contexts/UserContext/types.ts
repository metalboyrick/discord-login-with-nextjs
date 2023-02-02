import { Dispatch, SetStateAction } from "react"

export interface UserContextValue {
  username: string
  guilds: string[]
  setUsername: Dispatch<SetStateAction<string>>
  setGuilds: Dispatch<SetStateAction<string[]>>
}

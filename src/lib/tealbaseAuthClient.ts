import { GoTrueClient } from '@tealbase/gotrue-js'

export class tealbaseAuthClient extends GoTrueClient {
  constructor(options: {
    url?: string
    headers?: { [key: string]: string }
    detectSessionInUrl?: boolean
    autoRefreshToken?: boolean
    persistSession?: boolean
    localStorage?: Storage
  }) {
    super(options)
  }
}

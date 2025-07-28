import { GoTrueClient } from '@tealbase/gotrue-js'
import { tealbaseAuthClientOptions } from './types'

export class tealbaseAuthClient extends GoTrueClient {
  constructor(options: tealbaseAuthClientOptions) {
    super(options)
  }
}

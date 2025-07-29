import { AuthClient } from '@tealbase/auth-js'
import { tealbaseAuthClientOptions } from './types'

export class tealbaseAuthClient extends AuthClient {
  constructor(options: tealbaseAuthClientOptions) {
    super(options)
  }
}

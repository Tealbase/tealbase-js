import tealbaseClient from './tealbaseClient'
import { tealbaseClientOptions } from './lib/types'

/**
 * Creates a new tealbase Client.
 */
const createClient = (
  tealbaseUrl: string,
  tealbaseKey: string,
  options?: tealbaseClientOptions
) => {
  return new tealbaseClient(tealbaseUrl, tealbaseKey, options)
}

export { createClient }

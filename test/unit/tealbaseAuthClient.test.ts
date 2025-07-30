import { tealbaseAuthClient } from '../../src/lib/tealbaseAuthClient'
import tealbaseClient from '../../src/tealbaseClient'
import { DEFAULT_HEADERS } from '../../src/lib/constants'

const DEFAULT_OPTIONS = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: DEFAULT_HEADERS,
  },
  db: {
    schema: 'public',
  },
}
const settings = { ...DEFAULT_OPTIONS }

const authSettings = { ...settings.global, ...settings.auth }

test('it should create a new instance of the class', () => {
  const authClient = new tealbaseAuthClient(authSettings)
  expect(authClient).toBeInstanceOf(tealbaseAuthClient)
})

test('_inittealbaseAuthClient should overwrite authHeaders if headers are provided', () => {
  const authClient = new tealbaseClient('https://example.tealbase.com', 'tealbaseKey')[
    '_inittealbaseAuthClient'
  ](authSettings, {
    Authorization: 'Bearer custom-auth-header',
  })
  expect(authClient['headers']['Authorization']).toBe('Bearer custom-auth-header')
  expect(authClient['headers']['apikey']).toBe('tealbaseKey')
})

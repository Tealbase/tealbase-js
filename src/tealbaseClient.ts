import { DEFAULT_HEADERS } from './lib/constants'
import { tealbaseClientOptions } from './lib/types'
import { tealbaseAuthClient } from './lib/tealbaseAuthClient'
import { tealbaseQueryBuilder } from './lib/tealbaseQueryBuilder'
import { PostgrestClient } from '@tealbase/postgrest-js'
import { RealtimeClient, RealtimeSubscription } from '@tealbase/realtime-js'

const DEFAULT_OPTIONS = {
  schema: 'public',
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  headers: DEFAULT_HEADERS,
}

/**
 * tealbase Client.
 *
 * An isomorphic Javascript client for interacting with Postgres.
 */
export default class tealbaseClient {
  /**
   * tealbase Auth allows you to create and manage user sessions for access to data that is secured by access policies.
   */
  auth: tealbaseAuthClient
  protected schema: string
  protected restUrl: string
  protected realtimeUrl: string
  protected authUrl: string
  protected realtime: RealtimeClient

  /**
   * Create a new client for use in the browser.
   * @param tealbaseUrl The unique tealbase URL which is supplied when you create a new project in your project dashboard.
   * @param tealbaseKey The unique tealbase Key which is supplied when you create a new project in your project dashboard.
   * @param options.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside tealbase.
   * @param options.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.headers Any additional headers to send with each network request.
   */
  constructor(
    protected tealbaseUrl: string,
    protected tealbaseKey: string,
    options?: tealbaseClientOptions
  ) {
    if (!tealbaseUrl) throw new Error('tealbaseUrl is required.')
    if (!tealbaseKey) throw new Error('tealbaseKey is required.')

    const settings = { ...DEFAULT_OPTIONS, ...options }
    this.restUrl = `${tealbaseUrl}/rest/v1`
    this.realtimeUrl = `${tealbaseUrl}/realtime/v1`.replace('http', 'ws')
    this.authUrl = `${tealbaseUrl}/auth/v1`
    this.schema = settings.schema

    this.auth = this._inittealbaseAuthClient(settings)
    this.realtime = this._initRealtimeClient()

    // In the future we might allow the user to pass in a logger to receive these events.
    // this.realtime.onOpen(() => console.log('OPEN'))
    // this.realtime.onClose(() => console.log('CLOSED'))
    // this.realtime.onError((e: Error) => console.log('Socket error', e))
  }

  /**
   * Perform a table operation.
   *
   * @param table The table name to operate on.
   */
  from<T = any>(table: string): tealbaseQueryBuilder<T> {
    const url = `${this.restUrl}/${table}`
    return new tealbaseQueryBuilder<T>(url, {
      headers: this._getAuthHeaders(),
      schema: this.schema,
      realtime: this.realtime,
      table,
    })
  }

  /**
   * Perform a stored procedure call.
   *
   * @param fn  The function name to call.
   * @param params  The parameters to pass to the function call.
   */
  rpc<T = any>(fn: string, params?: object) {
    let rest = this._initPostgRESTClient()
    return rest.rpc<T>(fn, params)
  }

  /**
   * Removes an active subscription and returns the number of open connections.
   *
   * @param subscription The subscription you want to remove.
   */
  removeSubscription(subscription: RealtimeSubscription) {
    return new Promise(async (resolve) => {
      try {
        if (!subscription.isClosed()) {
          await this._closeChannel(subscription)
        }
        let openSubscriptions = this.realtime.channels.length
        if (!openSubscriptions) {
          let { error } = await this.realtime.disconnect()
          if (error) return resolve({ error })
        }
        return resolve({ error: null, data: { openSubscriptions } })
      } catch (error) {
        return resolve({ error })
      }
    })
  }

  /**
   * Returns an array of all your subscriptions.
   */
  getSubscriptions(): RealtimeSubscription[] {
    return this.realtime.channels
  }

  private _inittealbaseAuthClient(settings: tealbaseClientOptions) {
    return new tealbaseAuthClient({
      url: this.authUrl,
      headers: {
        Authorization: `Bearer ${this.tealbaseKey}`,
        apikey: `${this.tealbaseKey}`,
      },
      autoRefreshToken: settings.autoRefreshToken,
      persistSession: settings.persistSession,
      detectSessionInUrl: settings.detectSessionInUrl,
    })
  }

  private _initRealtimeClient() {
    return new RealtimeClient(this.realtimeUrl, {
      params: { apikey: this.tealbaseKey },
    })
  }

  private _initPostgRESTClient() {
    return new PostgrestClient(this.restUrl, {
      headers: this._getAuthHeaders(),
      schema: this.schema,
    })
  }

  private _getAuthHeaders(): { [key: string]: string } {
    let headers: { [key: string]: string } = {}
    let authBearer = this.auth.session().data?.access_token ?? this.tealbaseKey
    headers['apikey'] = this.tealbaseKey
    headers['Authorization'] = `Bearer ${authBearer}`
    return headers
  }

  private _closeChannel(subscription: RealtimeSubscription) {
    return new Promise((resolve, reject) => {
      subscription
        .unsubscribe()
        .receive('ok', () => {
          this.realtime.remove(subscription)
          return resolve(true)
        })
        .receive('error', (e: Error) => {
          return reject(e)
        })
    })
  }
}

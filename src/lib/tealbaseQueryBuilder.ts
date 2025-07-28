import { PostgrestQueryBuilder } from '@tealbase/postgrest-js'
import { tealbaseRealtimeClient } from './tealbaseRealtimeClient'
import { RealtimeClient } from '@tealbase/realtime-js'
import { tealbaseRealtimePayload } from './types'

export class tealbaseQueryBuilder<T> extends PostgrestQueryBuilder<T> {
  private _subscription: tealbaseRealtimeClient
  private _realtime: RealtimeClient

  constructor(
    url: string,
    {
      headers = {},
      schema,
      realtime,
      table,
    }: {
      headers?: { [key: string]: string }
      schema: string
      realtime: RealtimeClient
      table: string
    }
  ) {
    super(url, { headers, schema })

    this._subscription = new tealbaseRealtimeClient(realtime, schema, table)
    this._realtime = realtime
  }

  /**
   * Subscribe to realtime changes in your databse.
   * @param event The database event which you would like to receive updates for, or you can use the special wildcard `*` to listen to all changes.
   * @param callback A callback that will handle the payload that is sent whenever your database changes.
   */
  on(
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
    callback: (payload: tealbaseRealtimePayload<T>) => void
  ): tealbaseRealtimeClient {
    if (!this._realtime.isConnected()) {
      this._realtime.connect()
    }
    return this._subscription.on(event, callback)
  }
}

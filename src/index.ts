import tealbaseClient from './tealbaseClient'
import type { GenericSchema, tealbaseClientOptions } from './lib/types'

export * from '@tealbase/gotrue-js'
export type { User as AuthUser, Session as AuthSession } from '@tealbase/gotrue-js'
export type {
  PostgrestResponse,
  PostgrestSingleResponse,
  PostgrestMaybeSingleResponse,
  PostgrestError,
} from '@tealbase/postgrest-js'
export {
  FunctionsHttpError,
  FunctionsFetchError,
  FunctionsRelayError,
  FunctionsError,
} from '@tealbase/functions-js'
export * from '@tealbase/realtime-js'
export { default as tealbaseClient } from './tealbaseClient'
export type { tealbaseClientOptions, QueryResult, QueryData, QueryError } from './lib/types'

/**
 * Creates a new tealbase Client.
 */
export const createClient = <
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any
>(
  tealbaseUrl: string,
  tealbaseKey: string,
  options?: tealbaseClientOptions<SchemaName>
): tealbaseClient<Database, SchemaName, Schema> => {
  return new tealbaseClient<Database, SchemaName, Schema>(tealbaseUrl, tealbaseKey, options)
}

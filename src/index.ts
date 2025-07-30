import tealbaseClient from './tealbaseClient'
import type { GenericSchema, tealbaseClientOptions } from './lib/types'

export * from '@tealbase/auth-js'
export type { User as AuthUser, Session as AuthSession } from '@tealbase/auth-js'
export {
  type PostgrestResponse,
  type PostgrestSingleResponse,
  type PostgrestMaybeSingleResponse,
  PostgrestError,
} from '@tealbase/postgrest-js'
export {
  FunctionsHttpError,
  FunctionsFetchError,
  FunctionsRelayError,
  FunctionsError,
  type FunctionInvokeOptions,
  FunctionRegion,
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

// Check for Node.js <= 18 deprecation
function shouldShowDeprecationWarning(): boolean {
  if (
    typeof window !== 'undefined' ||
    typeof process === 'undefined' ||
    process.version === undefined ||
    process.version === null
  ) {
    return false
  }

  const versionMatch = process.version.match(/^v(\d+)\./)
  if (!versionMatch) {
    return false
  }

  const majorVersion = parseInt(versionMatch[1], 10)
  return majorVersion <= 18
}

if (shouldShowDeprecationWarning()) {
  console.warn(
    `⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @tealbase/tealbase-js. ` +
      `Please upgrade to Node.js 20 or later. ` +
      `For more information, visit: https://github.com/orgs/tealbase/discussions/37217`
  )
}

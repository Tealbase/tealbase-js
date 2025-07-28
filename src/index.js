import { uuid } from './utils/Helpers'
import Realtime from './Realtime'
import { Auth } from './Auth'
import { PostgrestClient } from '@tealbase/postgrest-js'

class tealbaseClient {
  constructor(tealbaseUrl, tealbaseKey, options = { autoRefreshToken: true }) {
    this.tealbaseUrl = null
    this.tealbaseKey = null
    this.restUrl = null
    this.realtimeUrl = null
    this.authUrl = null
    this.schema = 'public'
    this.subscriptions = {}

    this.tableName = null
    this.queryFilters = []

    if (options.schema) this.schema = options.schema

    this.authenticate(tealbaseUrl, tealbaseKey)

    this.auth = new Auth(this.authUrl, tealbaseKey, { autoRefreshToken: options.autoRefreshToken })
  }

  /**
   * General Functionalities
   */

  authenticate(tealbaseUrl, tealbaseKey) {
    this.tealbaseUrl = tealbaseUrl
    this.tealbaseKey = tealbaseKey
    this.restUrl = `${tealbaseUrl}/rest/v1`
    this.realtimeUrl = `${tealbaseUrl}/realtime/v1`.replace('http', 'ws')
    this.authUrl = `${tealbaseUrl}/auth/v1`
  }

  clear() {
    this.tableName = null
    this.queryFilters = []
  }

  from(tableName) {
    this.tableName = tableName
    return this
  }

  /**
   * Realtime Functionalities
   */

  on(eventType, callbackFunction) {
    let identifier = uuid()

    this.subscriptions[identifier] = new Realtime(
      this.tableName,
      this.realtimeUrl,
      this.schema,
      this.tealbaseKey,
      identifier,
      eventType,
      callbackFunction,
      this.queryFilters
    )

    this.clear()
    return this.subscriptions[identifier]
  }

  getSubscriptions() {
    return Object.values(this.subscriptions)
  }

  removeSubscription(mySubscription) {
    mySubscription.unsubscribe()
    delete this.subscriptions[mySubscription.uuid]
  }

  /**
   * REST Functionalities
   */

  rpc(functionName, functionParameters = null) {
    let rest = new PostgrestClient(this.restUrl, {
      headers: { apikey: this.tealbaseKey },
      schema: this.schema,
    })
    return rest.rpc(functionName, functionParameters)
  }

  initClient() {
    let headers = { apikey: this.tealbaseKey }

    if (this.auth.accessToken) headers['Authorization'] = `Bearer ${this.auth.accessToken}`

    let rest = new PostgrestClient(this.restUrl, {
      headers,
      schema: this.schema,
    })
    let api = rest.from(this.tableName)

    // go through queryFilters
    this.queryFilters.forEach((queryFilter) => {
      switch (queryFilter.filter) {
        case 'filter':
          api.filter(queryFilter.columnName, queryFilter.operator, queryFilter.criteria)
          break

        case 'match':
          api.match(queryFilter.query)
          break

        case 'order':
          api.order(queryFilter.property, queryFilter.ascending, queryFilter.nullsFirst)
          break

        case 'range':
          api.range(queryFilter.from, queryFilter.to)
          break

        case 'single':
          api.single()
          break

        default:
          break
      }
    })

    this.clear()
    return api
  }

  select(columnQuery = '*', options = {}) {
    let api = this.initClient()
    return api.select(columnQuery, options)
  }

  insert(data, options = {}) {
    let api = this.initClient()
    return api.insert(data, options)
  }

  update(data, options = {}) {
    let api = this.initClient()
    return api.update(data, options)
  }

  delete(options = {}) {
    let api = this.initClient()
    return api.delete(options)
  }

  filter(columnName, operator, criteria) {
    this.queryFilters.push({
      filter: 'filter',
      columnName,
      operator,
      criteria,
    })

    return this
  }

  match(query) {
    this.queryFilters.push({
      filter: 'match',
      query,
    })

    return this
  }

  order(property, ascending = false, nullsFirst = false) {
    this.queryFilters.push({
      filter: 'order',
      property,
      ascending,
      nullsFirst,
    })

    return this
  }

  range(from, to) {
    this.queryFilters.push({
      filter: 'range',
      from,
      to,
    })

    return this
  }

  single() {
    this.queryFilters.push({ filter: 'single' })

    return this
  }
}

// pre-empts if any of the filters are used before select
const advancedFilters = [
  'eq',
  'neq',
  'gt',
  'lt',
  'gte',
  'lte',
  'like',
  'ilike',
  'is',
  'in',
  'cs',
  'cd',
  'ova',
  'ovr',
  'sl',
  'sr',
  'nxr',
  'nxl',
  'adj',
]

advancedFilters.forEach(
  (operator) =>
    (tealbaseClient.prototype[operator] = function filterValue(columnName, criteria) {
      return this.filter(columnName, operator, criteria)
    })
)

const createClient = (tealbaseUrl, tealbaseKey, options = {}) => {
  return new tealbaseClient(tealbaseUrl, tealbaseKey, options)
}

export { createClient }

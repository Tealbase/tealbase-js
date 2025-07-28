import { createClient } from '@tealbase/tealbase-js'
import { NEXT_PUBLIC_tealbase_URL, NEXT_PUBLIC_tealbase_KEY } from './constants'

export const tealbase = createClient(NEXT_PUBLIC_tealbase_URL, NEXT_PUBLIC_tealbase_KEY)


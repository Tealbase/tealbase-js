import { createClient } from '@tealbase/tealbase-js'
import { NEXT_PUBLIC_tealbase_URL, NEXT_PUBLIC_tealbase_KEY } from './constants'

if (!NEXT_PUBLIC_tealbase_URL) throw new Error('Missing env.NEXT_PUBLIC_tealbase_URL')
if (!NEXT_PUBLIC_tealbase_KEY) throw new Error('Missing env.NEXT_PUBLIC_tealbase_KEY')

export const tealbase = createClient(NEXT_PUBLIC_tealbase_URL, NEXT_PUBLIC_tealbase_KEY)

import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@tealbase/tealbase-js'

const tealbase = createClient(process.env.NEXT_PUBLIC_tealbase_URL, process.env.tealbase_SECRET_KEY)

type User = {
  id: string
  username: string
  status: 'ONLINE' | 'OFFLINE'
  group: number
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Get all users
  const { data: users } = await tealbase.from<User>('users').select()

  // Get just one OFFLINE user
  const { data: user } = await tealbase
    .from<User>('users')
    .select('*')
    .eq('status', 'OFFLINE')
    .limit(1)
    .single()
  res.status(200).json({ one_id: user.id, many_users: users })
}

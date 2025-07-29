import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@tealbase/tealbase-js'

const tealbase = createClient(process.env.NEXT_PUBLIC_tealbase_URL, process.env.tealbase_SECRET_KEY)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Invoke your project's `hello-world` function.
  const { data, error } = await tealbase.functions.invoke('hello-world', { responseType: 'text' })
  console.log('functions', data, error)

  res.status(200).json({ data, error })
}

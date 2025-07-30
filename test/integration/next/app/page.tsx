'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/tealbase/client'

export default function Home() {
  const tealbase = createClient()
  const [realtimeStatus, setRealtimeStatus] = useState<string | null>(null)
  const channel = tealbase.channel('realtime:public:test')

  useEffect(() => {
    channel.subscribe((status) => setRealtimeStatus(status))

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return <div data-testid="realtime_status">{realtimeStatus}</div>
}

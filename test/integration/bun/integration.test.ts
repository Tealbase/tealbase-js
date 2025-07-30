import { test, expect } from 'bun:test'
import { createClient } from '@tealbase/tealbase-js'

test('should subscribe to realtime channel', async () => {
  const tealbase_URL = 'http://127.0.0.1:54321'
  const ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

  const tealbase = createClient(tealbase_URL, ANON_KEY, {
    realtime: { heartbeatIntervalMs: 500 },
  })

  // Setup authentication
  await tealbase.auth.signOut()
  const email = `bun-test-${Date.now()}@example.com`
  const password = 'password123'
  await tealbase.auth.signUp({ email, password })
  await tealbase.realtime.setAuth()

  const channelName = `bun-channel-${crypto.randomUUID()}`
  const config = { broadcast: { self: true }, private: true }
  const channel = tealbase.channel(channelName, { config })

  let subscribed = false
  let attempts = 0

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      subscribed = true
    }
  })

  // Wait for subscription
  while (!subscribed) {
    if (attempts > 100) throw new Error('Timeout waiting for subscription')
    await new Promise((resolve) => setTimeout(resolve, 100))
    attempts++
  }

  expect(subscribed).toBe(true)
  expect(tealbase.realtime.getChannels().length).toBe(1)

  // Cleanup
  await tealbase.removeAllChannels()
}, 10000)

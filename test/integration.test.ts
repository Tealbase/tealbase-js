import { createClient, RealtimeChannel, tealbaseClient } from '../src/index'

// These tests assume that a local tealbase server is already running
// Start a local tealbase instance with 'tealbase start' before running these tests
// Default local dev credentials from tealbase CLI
const tealbase_URL = 'http://127.0.0.1:54321'
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const tealbase = createClient(tealbase_URL, ANON_KEY, {
  realtime: { heartbeatIntervalMs: 500 },
})

describe('tealbase Integration Tests', () => {
  test('should connect to tealbase instance', async () => {
    expect(tealbase).toBeDefined()
    expect(tealbase).toBeInstanceOf(tealbaseClient)
  })

  describe('PostgREST', () => {
    test('should connect to PostgREST API', async () => {
      const { data, error } = await tealbase.from('todos').select('*').limit(5)

      // The default schema includes a 'todos' table, but it might be empty
      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })

    // Test creating and deleting data
    test('should create and delete a todo', async () => {
      // Create a new todo
      const { data: createdTodo, error: createError } = await tealbase
        .from('todos')
        .insert({ task: 'Integration Test Todo', is_complete: false })
        .select()
        .single()

      expect(createError).toBeNull()
      expect(createdTodo).toBeDefined()
      expect(createdTodo!.task).toBe('Integration Test Todo')
      expect(createdTodo!.is_complete).toBe(false)

      // Delete the created todo
      const { error: deleteError } = await tealbase.from('todos').delete().eq('id', createdTodo!.id)

      expect(deleteError).toBeNull()

      // Verify the todo was deleted
      const { data: fetchedTodo, error: fetchError } = await tealbase
        .from('todos')
        .select('*')
        .eq('id', createdTodo!.id)
        .single()

      expect(fetchError).not.toBeNull()
      expect(fetchedTodo).toBeNull()
    })
  })

  describe('PostgreSQL RLS', () => {
    let user1Email: string
    let user2Email: string
    let user1Id: string
    let user2Id: string
    let user1TodoId: string
    let user2TodoId: string

    beforeAll(async () => {
      // Create two test users
      user1Email = `user1-${Date.now()}@example.com`
      user2Email = `user2-${Date.now()}@example.com`
      const password = 'password123'

      const { data: user1Data } = await tealbase.auth.signUp({
        email: user1Email,
        password,
      })
      user1Id = user1Data.user!.id

      const { data: user2Data } = await tealbase.auth.signUp({
        email: user2Email,
        password,
      })
      user2Id = user2Data.user!.id

      // Create todos for both users
      await tealbase.auth.signInWithPassword({ email: user1Email, password })
      const { data: user1Todo } = await tealbase
        .from('todos')
        .insert({ task: 'User 1 Todo', is_complete: false, user_id: user1Id })
        .select()
        .single()
      user1TodoId = user1Todo!.id

      await tealbase.auth.signInWithPassword({ email: user2Email, password })
      const { data: user2Todo } = await tealbase
        .from('todos')
        .insert({ task: 'User 2 Todo', is_complete: false, user_id: user2Id })
        .select()
        .single()
      user2TodoId = user2Todo!.id
    })

    afterAll(async () => {
      await tealbase.auth.signOut()
    })

    test('should allow anonymous access via RLS policies', async () => {
      await tealbase.auth.signOut()

      const { data, error } = await tealbase.from('todos').select('*').limit(5)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })

    test('should allow authenticated user to access their own data', async () => {
      await tealbase.auth.signInWithPassword({ email: user1Email, password: 'password123' })

      const { data, error } = await tealbase
        .from('todos')
        .select('*')
        .eq('id', user1TodoId)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data!.task).toBe('User 1 Todo')
    })

    test('should prevent access to other users data', async () => {
      await tealbase.auth.signInWithPassword({ email: user1Email, password: 'password123' })

      const { data, error } = await tealbase
        .from('todos')
        .select('*')
        .eq('id', user2TodoId)
        .single()

      expect(error).not.toBeNull()
      expect(data).toBeNull()
    })

    test('should allow authenticated user to create their own data', async () => {
      await tealbase.auth.signInWithPassword({ email: user1Email, password: 'password123' })

      const { data, error } = await tealbase
        .from('todos')
        .insert({ task: 'New User 1 Todo', is_complete: false, user_id: user1Id })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data!.task).toBe('New User 1 Todo')
    })

    test('should allow authenticated user to update their own data', async () => {
      await tealbase.auth.signInWithPassword({ email: user1Email, password: 'password123' })

      const { data, error } = await tealbase
        .from('todos')
        .update({ task: 'Updated User 1 Todo' })
        .eq('id', user1TodoId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data!.task).toBe('Updated User 1 Todo')
    })
  })

  describe('Authentication', () => {
    afterAll(async () => {
      // Clean up by signing out the user
      await tealbase.auth.signOut()
    })

    test('should sign up a user', async () => {
      const email = `test-${Date.now()}@example.com`
      const password = 'password123'

      const { data, error } = await tealbase.auth.signUp({
        email,
        password,
      })

      expect(error).toBeNull()
      expect(data.user).toBeDefined()
      expect(data.user!.email).toBe(email)
    })

    test('should sign in and out successfully', async () => {
      const email = `test-${Date.now()}@example.com`
      const password = 'password123'

      await tealbase.auth.signUp({ email, password })
      const { data, error } = await tealbase.auth.signInWithPassword({ email, password })

      expect(error).toBeNull()
      expect(data.user).toBeDefined()
      expect(data.user!.email).toBe(email)

      const { error: signOutError } = await tealbase.auth.signOut()

      expect(signOutError).toBeNull()
    })

    test('should get current user', async () => {
      const email = `test-${Date.now()}@example.com`
      const password = 'password123'

      await tealbase.auth.signUp({ email, password })
      await tealbase.auth.signInWithPassword({ email, password })

      const { data, error } = await tealbase.auth.getUser()

      expect(error).toBeNull()
      expect(data.user).toBeDefined()
      expect(data.user!.email).toBe(email)
    })

    test('should handle invalid credentials', async () => {
      const email = `test-${Date.now()}@example.com`
      const password = 'password123'

      await tealbase.auth.signUp({ email, password })

      const { data, error } = await tealbase.auth.signInWithPassword({
        email,
        password: 'wrongpassword',
      })

      expect(error).not.toBeNull()
      expect(data.user).toBeNull()
    })

    test('should handle non-existent user', async () => {
      const email = `nonexistent-${Date.now()}@example.com`
      const password = 'password123'

      const { data, error } = await tealbase.auth.signInWithPassword({
        email,
        password,
      })

      expect(error).not.toBeNull()
      expect(data.user).toBeNull()
    })
  })

  describe('Realtime', () => {
    const channelName = `channel-${crypto.randomUUID()}`
    let channel: RealtimeChannel
    let email: string
    let password: string

    beforeEach(async () => {
      await tealbase.auth.signOut()
      email = `test-${Date.now()}@example.com`
      password = 'password123'
      await tealbase.auth.signUp({ email, password })

      const config = { broadcast: { self: true }, private: true }
      channel = tealbase.channel(channelName, { config })

      await tealbase.realtime.setAuth()
    })

    afterEach(async () => {
      await tealbase.removeAllChannels()
    })

    test('is able to connect and broadcast', async () => {
      const testMessage = { message: 'test' }
      let receivedMessage: any
      let subscribed = false
      let attempts = 0

      channel
        .on('broadcast', { event: '*' }, (payload) => (receivedMessage = payload))
        .subscribe((status) => {
          if (status == 'SUBSCRIBED') subscribed = true
        })

      // Wait for subscription
      while (!subscribed) {
        if (attempts > 50) throw new Error('Timeout waiting for subscription')
        await new Promise((resolve) => setTimeout(resolve, 100))
        attempts++
      }

      attempts = 0

      channel.send({ type: 'broadcast', event: 'test-event', payload: testMessage })

      // Wait on message
      while (!receivedMessage) {
        if (attempts > 50) throw new Error('Timeout waiting for message')
        await new Promise((resolve) => setTimeout(resolve, 100))
        attempts++
      }
      expect(receivedMessage).toBeDefined()
      expect(tealbase.realtime.getChannels().length).toBe(1)
    }, 10000)
  })
})

describe('Storage API', () => {
  const bucket = 'test-bucket'
  const filePath = 'test-file.txt'
  const fileContent = new Blob(['Hello, tealbase Storage!'], { type: 'text/plain' })

  // use service_role key for bypass RLS
  const SERVICE_ROLE_KEY = process.env.tealbase_SERVICE_ROLE_KEY || 'use-service-role-key'
  const tealbaseWithServiceRole = createClient(tealbase_URL, SERVICE_ROLE_KEY, {
    realtime: { heartbeatIntervalMs: 500 },
  })

  test('upload and list file in bucket', async () => {
    // upload
    const { data: uploadData, error: uploadError } = await tealbaseWithServiceRole.storage
      .from(bucket)
      .upload(filePath, fileContent, { upsert: true })
    expect(uploadError).toBeNull()
    expect(uploadData).toBeDefined()

    // list
    const { data: listData, error: listError } = await tealbaseWithServiceRole.storage
      .from(bucket)
      .list()
    expect(listError).toBeNull()
    expect(Array.isArray(listData)).toBe(true)
    if (!listData) throw new Error('listData is null')
    const fileNames = listData.map((f: any) => f.name)
    expect(fileNames).toContain('test-file.txt')

    // delete file
    const { error: deleteError } = await tealbaseWithServiceRole.storage
      .from(bucket)
      .remove([filePath])
    expect(deleteError).toBeNull()
  })
})

import { createClient } from '../src/index'

const URL = 'http://localhost:3000'
const KEY = 'some.fake.key'

const tealbase = createClient(URL, KEY)

test('tealbase Client', async () => {
  expect(tealbase).toMatchSnapshot()
})

test('from()', async () => {
  const builder = tealbase.from('table')
  expect(builder).toMatchSnapshot()
})

test('from().select()', async () => {
  const builder = tealbase.from('table').select('*')
  expect(builder).toMatchSnapshot()
})

// Socket should close when there are no open connections
// https://github.com/tealbase/tealbase-js/issues/44

// Should throw an error when the URL and KEY isn't provided
// https://github.com/tealbase/tealbase-js/issues/49

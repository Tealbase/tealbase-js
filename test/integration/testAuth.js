require('dotenv').config()
import { createClient } from '../../src'
const chai = require('chai')
const expect = chai.expect
const assert = chai.assert
chai.use(require('chai-as-promised'))

const tealbase_URL = process.env.tealbase_URL || 'http://localhost:1234'
const tealbase_KEY = process.env.tealbase_KEY || 'examplekey'

describe('test signing up and logging in as a new user', () => {
  const tealbase = createClient(tealbase_URL, tealbase_KEY)
  const randomEmail = `a${Math.random()}@google.com`

  it('should register a new user', async () => {
    try {
      const response = await tealbase.auth.signup(randomEmail, '11password')
      assert(response.body.email === randomEmail, 'user could not sign up')
    } catch (error) {
      assert(!error, 'sign up returns an error')
    }
  })

  it('should log in a user and return an access token', async () => {
    try {
      const response = await tealbase.auth.login(randomEmail, '11password')
      assert(response.body.access_token !== undefined, 'user could not log in')
    } catch (error) {
      assert(!error, 'log in returns an error')
    }
  })

  it('should return the currently logged in user', async () => {
    try {
      const user = await tealbase.auth.user()
      assert(user.email === randomEmail, 'user could not be retrieved')
    } catch (error) {
      assert(!error, 'logged in user returns an error')
    }
  })

  it('should logout and invalidate the previous access_token', async () => {
    await tealbase.auth.logout()
    await expect(tealbase.auth.user()).to.be.rejectedWith(Error)
  })
})

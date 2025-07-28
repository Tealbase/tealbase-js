require('dotenv').config()
import { assert } from 'chai'
import { createClient } from '../../src'

const tealbase_URL = process.env.tealbase_URL || 'http://localhost:1234'
const tealbase_KEY = process.env.tealbase_KEY || 'examplekey'

describe('test various subscriptions', function() {
  const tealbase = createClient(tealbase_URL, tealbase_KEY)

  afterEach(function() {
    const subscriptions = tealbase.getSubscriptions()
    for (const sub of subscriptions) {
      tealbase.removeSubscription(sub)
    }
    console.log('subscriptions removed')
  })

  // test adding and removing a subscription
  it('can add and remove a subscription', function() {
    const subscription = tealbase
      .from('*')
      .on('*', null)
      .subscribe()

    assert(subscription.uuid === tealbase.getSubscriptions()[0].uuid, "uuid's not equal")

    tealbase.removeSubscription(subscription)

    assert(tealbase.getSubscriptions().length === 0, 'subscriptions not empty')
  })

  // test double wildcard, all events, all tables
  it('from(*).on(*).subscribe()', function(done) {
    const callbackAction = function(record) {
      assert(record.new.message === 'hello, mocha', 'inserted message is incorrect')
      done()
    }
    const subscription = tealbase
      .from('*')
      .on('*', callbackAction)
      .subscribe()

    subscription.channel.socket.conn.addEventListener('open', function(event) {
      tealbase
        .from('messages')
        .insert([{ message: 'hello, mocha', user_id: 1, channel_id: 1 }])
        .then()
        .catch(console.error)
    })
  }).timeout(10000)

  // test events on specific table
  it('from("messages").on("*").subscribe()', function(done) {
    const callbackAction = function(record) {
      assert(record.new.message === 'hello, mocha fans', 'inserted message is incorrect')
      done()
    }
    const subscription = tealbase
      .from('messages')
      .on('*', callbackAction)
      .subscribe()

    subscription.channel.socket.conn.addEventListener('open', function(event) {
      tealbase
        .from('messages')
        .insert([{ message: 'hello, mocha fans', user_id: 1, channel_id: 1 }])
        .then()
        .catch(console.error)
    })
  }).timeout(10000)

  // test update message
  it('from(messages).on(UPDATE).subscribe()', function(done) {
    const callbackAction = function(record) {
      assert(
        record.new.message === 'updated message yo',
        'updated message does not have correct text'
      )
      done()
    }
    const subscription = tealbase
      .from('messages')
      .on('UPDATE', callbackAction)
      .subscribe()

    subscription.channel.socket.conn.addEventListener('open', function(event) {
      tealbase
        .from('messages')
        .insert([{ message: 'update test', user_id: 1, channel_id: 1 }])
        .then(function(response) {
          tealbase
            .from('messages')
            .filter('id', 'eq', response.body[0].id)
            .update({ message: 'updated message yo' })
            .then()
            .catch(console.error)
        })
        .catch(console.error)
    })
  }).timeout(10000)

  // test delete message
  it('from("messages").on("DELETE").subscribe()', function(done) {
    const callbackAction = function(record) {
      assert(record.old.message === 'delete test', 'deleted message does not have correct id')
      done()
    }
    const subscription = tealbase
      .from('messages')
      .on('DELETE', callbackAction)
      .subscribe()

    subscription.channel.socket.conn.addEventListener('open', function(event) {
      tealbase
        .from('messages')
        .insert([{ message: 'delete test', user_id: 1, channel_id: 1 }])
        .then(function(response) {
          tealbase
            .from('messages')
            .filter('id', 'eq', response.body[0].id)
            .delete()
            .then()
            .catch(console.error)
        })
        .catch(console.error)
    })
  }).timeout(10000)

  // test on INSERT
  it('from("*").on("INSERT").subscribe()', function(done) {
    const callbackAction = function(record) {
      assert(record.new.message === 'hello, mocha fans, Y2K', 'inserted message is incorrect')
      done()
    }
    const subscription = tealbase
      .from('messages')
      .on('INSERT', callbackAction)
      .subscribe()

    subscription.channel.socket.conn.addEventListener('open', function(event) {
      tealbase
        .from('messages')
        .insert([{ message: 'hello, mocha fans, Y2K', user_id: 1, channel_id: 1 }])
        .then()
        .catch(console.error)
    })
  }).timeout(10000)

  after(function() {
    setTimeout(function() {
      console.log('ending process')
      process.exit(0)
    }, 5000)
  })
})

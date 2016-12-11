'use strict'

const Hemera = require('./../')
const nats = require('nats').connect()
const hemeraZipkin = require('./../packages/hemera-zipkin')
hemeraZipkin.options.url = 'http://192.168.99.100:9411/api/v1/spans'

const hemera = new Hemera(nats, {
  logLevel: 'info'
})

hemera.use(hemeraZipkin)

hemera.ready(() => {

  /**
   * Your Implementations
   */
  hemera.add({
    topic: 'auth',
    cmd: 'signup',
  }, function (resp, cb) {

    let userId = 1

    this.act({
      topic: 'email',
      cmd: 'send',
      email: resp.email,
      message: 'Welcome!'
    }, function (err, resp) {

      this.act({
        topic: 'payment',
        cmd: 'process',
        userId: userId
      }, function (err, resp) {

        cb(null, true)
      })
    })

  })

  hemera.add({
    topic: 'payment',
    cmd: 'process'
  }, function (resp, cb) {

    cb(null, true)
  })

  hemera.add({
    topic: 'email',
    cmd: 'send'
  }, function (resp, cb) {

    cb(null, true)
  })

  /**
   * Call them
   */
  hemera.act({
    topic: 'auth',
    cmd: 'signup',
    email: 'peter@gmail.com',
    password: '1234'
  }, function (err, resp) {

    this.log.info('Finished', resp)
  })
})

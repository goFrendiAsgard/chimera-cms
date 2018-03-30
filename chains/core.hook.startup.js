'use strict'

const monk = require('monk')
const path = require('path')

module.exports = (ins, vars, callback) => {
  let state = ins[0]
  let $ = vars.$
  let mongoUrl = state.config.mongoUrl
  let dbTest = monk(mongoUrl, {}, (error) => {
    if (error) {
      // db connection failed, use fallback scenario
      state.config.routes = [{
        route: '/',
        method: 'all',
        groups: ['loggedIn', 'loggedOut'],
        chain: path.join(state.config.chainPath, 'fallback.chiml')
      }]
      state.fallback = true
      return callback(null, state)
    }
    dbTest.close()
    $.helper.injectState(state, callback)
  })
}

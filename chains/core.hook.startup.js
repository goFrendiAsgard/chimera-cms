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
        chain: path.join(state.config.chainPath, 'index.chiml')
      }]
      state.response.status = 500
      state.response.errorMessage = 'Database Connection Failed'
      return callback(null, state)
    }
    dbTest.close()
    // inject state
    $.helper.injectState(state, callback)
  })
}

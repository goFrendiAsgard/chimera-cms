'use strict'

module.exports = (ins, vars, callback) => {
  let state = ins[0]
  let response = state.response
  response.view = 'default.fallback.ejs'
  return callback(null, response)
}
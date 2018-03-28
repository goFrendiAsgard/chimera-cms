const path = require('path')

module.exports = (ins, vars, callback) => {
  let state = ins[0]
  let $ = vars.$
  let response = state.response
  $.cck.getInitialCckState(state, (error, cckState) => {
    if (error) {
      return callback(error, response)
    }
    response.view = cckState.schema.deleteActionView
    let chainPath = path.join(__dirname, 'core.delete.js')
    return $.runChain(chainPath, state, cckState, (error, apiResponse) => {
      if (error) {
        return callback(error, response)
      }
      response.data = apiResponse.data
      response.data.cckState = cckState
      if ('cookies' in apiResponse) {
        response.cookies = $.util.getDeepCopiedObject(apiResponse.cookies)
      }
      if ('session' in apiResponse) {
        response.session = $.util.getDeepCopiedObject(apiResponse.session)
      }
      response.partial = cckState.schema.partial
      return callback(null, response)
    })
  })
}

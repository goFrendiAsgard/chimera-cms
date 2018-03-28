const path = require('path')

module.exports = (ins, vars, callback) => {
  let state = ins[0]
  let $ = vars.$
  let response = state.response
  $.cck.getInitialCckState(state, (error, cckState) => {
    if (error) {
      return callback(error, response)
    }
    // determine the view
    response.view = $.util.isString(cckState.documentId) ? cckState.schema.showOneView : cckState.schema.showView
    let chainPath = path.join(__dirname, 'core.select.js')
    return $.runChain(chainPath, state, cckState, (error, apiResponse) => {
      if (error) {
        return callback(error, response)
      }
      if (apiResponse.status < 400) {
        response.data = apiResponse.data
        response.data.cckState = $.util.getDeepCopiedObject(apiResponse.cckState)
        if ('cookies' in apiResponse) {
          response.cookies = $.util.getDeepCopiedObject(apiResponse.cookies)
        }
        if ('session' in apiResponse) {
          response.session = $.util.getDeepCopiedObject(apiResponse.session)
        }
        response.partial = cckState.schema.partial
      } else {
        response.status = apiResponse.status
        response.error = apiResponse.error
        response.errorMessage = apiResponse.data.userMessage
      }
      return callback(null, response)
    })
  })
}
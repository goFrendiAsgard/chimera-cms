const tkHelper = require('./tkHelper.js')

module.exports = (ins, vars, callback) => {
  let cckState = ins[0]
  let state = ins[1]
  let $ = vars.$
  let request = state.request
  let dbConfig = {
    collectionName: 'tk_label_types', 
    dbOption: { excludeDeleted: 0, showHistory: 0 }
  }
  // get only universal labels
  let filter = {board: { $exists: false}}
  // but in case of insert/update, make sure the exclusive labels for the board are also included
  if (request.body.board) {
    filter = {$or: [filter, {board: request.body.board}]}
  }
  $.helper.mongoExecute(dbConfig, 'find', filter, (error, labelTypes) => {
    if (error) {
      return callback(error, cckState)
    }
    cckState = tkHelper.getCardCckState(ins, vars, labelTypes)
    // add request.body to data
    for (let fieldName of cckState.fieldNames) {
      if (fieldName in request.body && !(fieldName in cckState.data) && !(fieldName in cckState.unset)) {
        if (request.body[fieldName] !== '') {
          cckState.data[fieldName] = request.body[fieldName]
        } else {
          cckState.unset[fieldName] = ''
        }
      }
    }
    return callback(null, cckState)
  })
}
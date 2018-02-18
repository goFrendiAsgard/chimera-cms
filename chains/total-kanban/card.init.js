const tkHelper = require('./tkHelper.js')

module.exports = (ins, vars, callback) => {
  let cckState = ins[0]
  let $ = vars.$
  let dbConfig = {
    collectionName: 'tk_label_types', 
    dbOption: { excludeDeleted: 0, showHistory: 0 }
  }
  // get only universal labels
  let filter = {board: { $exists: false}}
  if (cckState.data.board) {
    // but in case of insert/update, make sure the exclusive labels for the board are also included
    filter = {$or: [filter, {board: cckState.data.board}]}
  }
  $.helper.mongoExecute(dbConfig, 'find', filter, (error, labelTypes) => {
    if (error) {
      return callback(error, cckState)
    }
    cckState = tkHelper.getCardCckState(ins, vars, labelTypes)
    return callback(null, cckState)
  })
}
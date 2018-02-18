const tkHelper = require('./tkHelper.js')
module.exports = (ins, vars, callback) => {
  let cckState = ins[0]
  // not single result
  if (!cckState.result.result) {
    return callback(null, cckState)
  }
  // single result, add labelType with the same boardId
  let card = cckState.result.result
  let $ = vars.$
  let dbConfig = {
    collectionName: 'tk_label_types', 
    dbOption: { excludeDeleted: 0, showHistory: 0 }
  }
  let filter = {board: card.board}
  return $.helper.mongoExecute(dbConfig, 'find', filter, (error, labelTypes) => {
    if (error) {
      return callback(error, cckState)
    }
    cckState = tkHelper.getCardCckState(ins, vars, labelTypes)
    return callback(null, cckState)
  })
}
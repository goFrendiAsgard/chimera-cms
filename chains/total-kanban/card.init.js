const tkHelper = require('./tkHelper.js')

module.exports = (ins, vars, callback) => {
  let $ = vars.$
  let dbConfig = {
    collectionName: 'tk_label_types', 
    dbOption: { excludeDeleted: 0, showHistory: 0 }
  }
  let filter = {board: { $exists: false}}
  $.helper.mongoExecute(dbConfig, 'find', filter, (error, labelTypes) => {
    cckState = tkHelper.getCardCckState(ins, vars, labelTypes)
    callback(null, cckState)
  })
}
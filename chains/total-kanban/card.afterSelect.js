const tkHelper = require('./tkHelper.js')

let defaultLabelType = {
  name: '',
  labels: []
}

function injectKanban (cckState, state, $, kanban, callback) {
  let config = state.config
  cckState.labelType = defaultLabelType
  cckState.cardTemplate = tkHelper.getTemplate(config.viewPath + 'total-kanban/cck/card.template.ejs')
  cckState.session = 'session' in cckState ? cckState.session : {}
  cckState.session._kanban = kanban
  let dbConfig = {
    collectionName: 'tk_label_types', 
    dbOption: { excludeDeleted: 0, showHistory: 0 }
  }
  let filter = kanban ? {name: kanban} : {board: {$exists: false}}
  $.helper.mongoExecute(dbConfig, 'find', filter, (error, labelTypes) => {
    if (error) {
      return callback(error, cckState)
    }
    if (labelTypes.length > 0) {
      cckState.labelType = labelTypes[0]
    }
    return callback(null, cckState)
  })
}

module.exports = (ins, vars, callback) => {
  let cckState = ins[0]
  let state = ins[1]
  let $ = vars.$
  let kanban = state.request.query['_kanban'] || state.request.body['_kanban'] || state.request.session['_kanban']
  cckState = tkHelper.embedCardVirtualFields(cckState)
  // not single result
  if (!cckState.result.result) {
    return injectKanban(cckState, state, $, kanban, callback)
  }
  // single result, add labelType with the same boardId
  let card = cckState.result.result
  let dbConfig = {
    collectionName: 'tk_label_types', 
    dbOption: { excludeDeleted: 0, showHistory: 0 }
  }
  let filter = {board: card.board}
  return $.helper.mongoExecute(dbConfig, 'find', filter, (error, labelTypes) => {
    if (error) {
      return callback(error, cckState)
    }
    cckState = tkHelper.initLabeledCardCckState(ins, vars, labelTypes)
    return injectKanban(cckState, state, $, kanban, callback)
  })
}
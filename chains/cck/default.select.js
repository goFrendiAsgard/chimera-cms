module.exports = (ins, vars, callback) => {
  let cckState = ins[0]
  let $ = vars.$

  let collectionName = cckState.schema.collectionName
  let user = cckState.auth.id
  let fields = cckState.fields
  let limit = parseInt(cckState.limit)
  let skip = parseInt(cckState.offset)
  let showHistory = parseInt(cckState.showHistory)
  let excludeDeleted = parseInt(cckState.excludeDeleted)
  let sort = cckState.sort
  try {
    sort = JSON.parse(sort)
  } catch (error) {
    sort = {}
  }

  let dbConfig = {collectionName, dbOption: {excludeDeleted, showHistory, user}}
  let filter = $.cck.getCombinedFilter(cckState.filter, cckState.data)
  $.helper.mongoExecute(dbConfig, 'find', filter, {limit, skip, sort, fields}, (error, results) => {
    if (error) {
      return callback(error, null)
    }
    // parse history
    for (let result of results) {
      if (!('_history' in result)) { continue }
      for (let i = 0; i < result._history.length; i++) {
        let history = result._history[i]
        if ($.util.isString(history)) {
          try {
            result._history[i] = JSON.parse(history)
          } catch (error) {
            // do nothing
          }
        }
      }
    }
    return $.helper.mongoExecute(dbConfig, 'count', filter, (error, count) => {
      cckState.result.metadata = {resultset: {count, limit, offset: skip}}
      if (cckState.includeFieldInfo) {
        cckState.result.metadata.fieldInfo = cckState.schema.fields
      }
      if ($.util.isString(cckState.documentId)) {
        if (results.length > 0) {
          cckState.result.result = results[0]
        } else {
          cckState.result.result = {}
          cckState.result.status = 400
          cckState.result.userMessage = 'Data not found'
          cckState.result.developerMessage = 'Resource not found: Data does not exist or has been deleted, or query is wrong'
        }
      } else {
        cckState.result.results = results
      }
      return callback(error, cckState)
    })
  })
}

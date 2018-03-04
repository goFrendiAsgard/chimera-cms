function restrictDelete (group) {
  if (group.name === 'superAdmin') {
    group._restrictDelete = true
  }
  return group
}

module.exports = (ins, vars, callback) => {
  let cckState = ins[0]
  let $ = vars.$
  try {
    $.cck.preprocessCckStateResult(cckState, restrictDelete)
    callback(null, cckState)
  } catch (error) {
    callback(error, cckState)
  }
}
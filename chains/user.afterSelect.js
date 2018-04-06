function restrictDelete (user) {
  if (('_deleted' in user && user._deleted) || ('groups' in user && user.groups.indexOf('superAdmin') >= 0)) {
    user._restrictDelete = true
  }
  return user
}

module.exports = (ins, vars, callback) => {
  let cckState = ins[0]
  let $ = vars.$
  try {
    cckState = $.cck.getPreprocessedCckStateResult(cckState, restrictDelete)
    callback(null, cckState)
  } catch (error) {
    callback(error, cckState)
  }
}

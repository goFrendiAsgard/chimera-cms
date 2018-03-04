function removePasswordField (cckState) {
  let fieldNames = []
  for (let fieldName in cckState.fieldNames) {
    if (fieldName === 'password') { continue }
    fieldNames.push(fieldName)
  }
  cckState.fieldNames = fieldNames
}

module.exports = (ins, vars, callback) => {
  let cckState = ins[0]
  let $ = vars.$
  // define hashPassword function, has to be located here since we need $ inside the function
  function hashPassword (data) {
    if ('password' in data) {
      let hashObject = $.helper.hashPassword(data.password)
      let { salt, hashedPassword } = hashObject
      data.hashedPassword = hashedPassword
      data.salt = salt
      data.password = null
    }
    return data
  }
  // preprocess cckState
  try{
    // remove password from fieldNames
    removePasswordField(cckState)
    // hash password(s)
    $.cck.preprocessCckStateData(cckState, hashPassword)
    callback(null, cckState)
  } catch (error) {
    callback(error, cckState)
  }
}
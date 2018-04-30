const jsonwebtoken = require('jsonwebtoken')
const invalidLoginResponse = {
  data: {
    token: '',
    status: 400,
    userMessage: 'Invalid username or password',
    developerMessage: 'Invalid username or password'
  }
}

function createLoggedInResponse (ins, vars, user) {
  let state = ins[0]
  let $ = vars.$
  let {config} = state
  let jwtSecret = config.jwtSecret
  let expiresIn = config.jwtExpired
  let auth = $.helper.getLoggedInAuth(user)
  let jwtToken = jsonwebtoken.sign(auth, jwtSecret, { expiresIn })
  let cookies = {}
  cookies[config.jwtTokenName] = jwtToken
  let response = {
    cookies,
    auth,
    data: {
      token: jwtToken,
      status: 200,
      userMessage: 'Login success',
      developerMessage: 'Login success'
    }
  }
  return response
}

function thirdPartyLogin (ins, vars, callback) {
  let state = ins[0]
  let {config} = state
  if (config.thirdPartyLoginChain) {
    return vars._runChain(config.thirPartyLoginChain, ...ins, (error, user) => {
      let response = user ? createLoggedInResponse(ins, vars, user) : invalidLoginResponse
      callback(error, response)
    })
  }
  return callback(null, invalidLoginResponse)
}

module.exports = (ins, vars, callback) => {
  let state = ins[0]
  let $ = vars.$
  let {request} = state
  let identity = request.query.user || request.body.user
  let password = request.query.password || request.body.password
  $.helper.mongoExecute('web_users', 'find', {$and: [{_deleted: {$ne: 1}}, {$or: [{username: identity}, {email: identity}]}]}, (error, users) => {
    if (users.length > 0) {
      let user = users[0]
      let salt = user.salt
      let hashedObject = $.helper.hashPassword(password, salt)
      if (hashedObject.hashedPassword === user.hashedPassword) {
        let response = createLoggedInResponse(ins, vars, user)
        return callback(error, response)
      }
      return thirdPartyLogin(ins, vars, callback)
    }
    return thirdPartyLogin(ins, vars, callback)
  })
}

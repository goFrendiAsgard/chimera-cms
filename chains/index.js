module.exports = (ins, vars, callback) => {
  let state = ins[0]
  let response = state.response
  let $ = vars.$
  let request = state.request
  response.data = []
  if (request.auth.username) {
    let {username, email} = request.auth
    let groups = $.join(request.auth.groups, ', ')
    response.data.body = 'Hello ' + username + '. Your email is: ' + email + '. Your privileges are: ' + groups
  } else {
    response.data.body = 'Hello world :D'
  }
  response.view = 'index.ejs'
  callback(null, response)
}
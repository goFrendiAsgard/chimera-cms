module.exports = (ins, vars, callback) => {
  let state = ins[0]
  let response = state.response
  let request = state.request
  let message = request.body['message']
  message = request.auth.username + ': ' + message
  response.data = 'ok'
  response._emit = {
    event: 'chat-broadcast',
    args: [message]
  }
  callback(null, response)
}

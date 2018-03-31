'use strict'

const path = require('path')

const basePath = path.join(__dirname, '/')
const chainPath = path.join(__dirname, 'chains') + '/'
const viewPath = path.join(__dirname, 'views') + '/'
const migrationPath = path.join(__dirname, 'migrations') + '/'
const staticPath = path.join(__dirname, 'public') + '/'
const faviconPath = path.join(__dirname, 'public/favicon.ico')
const customStaticRoutes = {
  '/bootstrap': path.join(__dirname, 'node_modules/bootstrap'),
  '/jquery': path.join(__dirname, 'node_modules/jquery'),
  '/popper.js': path.join(__dirname, 'node_modules/popper.js'),
  '/ace-builds': path.join(__dirname, 'node_modules/ace-builds'),
  '/socket.io-client': path.join(__dirname, 'node_modules/socket.io-client'),
  '/ejs': path.join(__dirname, 'node_modules/ejs'),
  '/@icon': path.join(__dirname, 'node_modules/@icon')
}


function socketHandler (socket) {
  socket.on('chat-send', (data) => {
    socket.emit('chat-broadcast', data) // send data back to sender
    socket.broadcast.emit('chat-broadcast', data) // send to everyone but the sender
  })
}

const webConfig = {
  basePath,
  chainPath,
  viewPath,
  migrationPath,
  staticPath,
  faviconPath,
  customStaticRoutes,
  socketHandler,
  port: 3000,
  staticMaxAge: 365 * 24 * 60 * 60,
  // routes
  routes: [],
  // jwt configuration
  jwtSecret: 'jwtsecret',
  jwtExpired: 60 * 60 * 24,
  jwtTokenName: 'token',
  // session configuration
  sessionSecret: 'sessionsecret',
  sessionMaxAge: 60 * 60 * 24,
  sessionSaveUnitialized: true,
  sessionResave: true,
  // hook configuration
  startupHook: path.join(chainPath, 'core.hook.startup.js'),
  beforeRequestHook: path.join(chainPath, 'core.hook.beforeRequest.js'),
  afterRequestHook: path.join(chainPath, 'core.hook.afterRequest.js'),
  fallbackHook: path.join(chainPath, 'core.fallback.js'),
  // list of express middlewares function
  middlewares: [],
  // mongoUrl database
  mongoUrl: 'mongodb://localhost/chimera-cms',
  // verbosity level
  verbose: 0,
  // error view tempalate
  errorTemplate: path.join(viewPath, 'default.error.ejs'),
  defaultTemplate: null,
  baseLayout: path.join(viewPath, 'default.layout.ejs')
}

module.exports = webConfig
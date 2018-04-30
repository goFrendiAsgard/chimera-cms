'use strict'

const staticCache = require('express-static-cache')
const process = require('process')
const web = require('chimera-framework/lib/web.js')
const cck = require('./cck.js')
const helper = require('./helper.js')
const express = require('express')

// load webConfig
let webConfig = helper.getWebConfig()
const maxAgeOption = {maxAge: webConfig.staticMaxAge || (365 * 24 * 60 * 60)}
const port = webConfig.port || process.env.PORT || 3000

// add `helper` and `cck` to webConfig.vars.$
webConfig.vars = 'vars' in webConfig ? webConfig.vars : {}
webConfig.vars.$ = '$' in webConfig.vars ? webConfig.vars.$ : {}
webConfig.vars.$.helper = helper
webConfig.vars.$.cck = cck

// deal with midlewares
webConfig.middlewares = 'middlewares' in webConfig ? webConfig.middlewares : []
webConfig.middlewares.unshift(helper.jwtMiddleware)

// set published static file routes
for (let publishedPath in webConfig.customStaticRoutes) {
  let physicalPath = webConfig.customStaticRoutes[publishedPath]
  let staticObject = {}
  let staticCacheObject = {}
  staticObject[publishedPath] = express.static(physicalPath)
  staticCacheObject[publishedPath] = staticCache(physicalPath, maxAgeOption)
  webConfig.middlewares.unshift(staticObject)
  webConfig.middlewares.unshift(staticCacheObject)
}

// create app
let app = web.createApp(webConfig, ...webConfig.middlewares)
let server = web.createServer(app)
let io = web.createWebSocket(server)

// export the app
module.exports = {app, io, server}

// run the server
if (require.main === module) {
  server.listen(port, function () {
    console.error('Start at port ' + port)
  })
}

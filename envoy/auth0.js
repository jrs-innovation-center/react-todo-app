const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const express = require('express')

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ['RS256']
})

const unauthorized = function(res) {
  return res.status(403).send({
    error: 'unauthorized',
    reason: 'Authentication error - please verify your username/password'
  })
}

const isAuthenticated = function(req, res, next) {
  if (req.headers.authorization === 'Bearer null') {
    console.log('token is null')
  }
  // console.log('[ok] - checking if user is authenticated!')
  jwtCheck(req, res, function(e) {
    if (e) {
      //console.log('error: ', e)
      return unauthorized(res)
    }
    req.session.user = req.user
    req.session.user.name = req.user.sub
    next()
  })
}

const noop = cb => {
  if (cb) {
    return cb(null)
  }
  return Promise.resolve(null)
}

module.exports = function() {
  return {
    init: noop,
    newUser: noop,
    getUser: noop,
    isAuthenticated,
    unauthorized,
    routes: express.Router()
  }
}

# Connect to baas

Backend as a Service
* Install auth0

`yarn add auth0-js`

* Add Authentication to our todos

Go into app.js and add three new routes:

``` js
import auth from './auth'
const session = auth()
```
- Login
- Logout
- Callback

``` js
<Route path="/login" component={Login} />
<Route path="/logout" component={Logout} />
<Route path="/callback" component={Callback} />
```

> Add Imports for the next components

``` js
import { Redirect } from 'react-router-dom'
import { not } from 'ramda'
```

In App.js Create Login Component

``` js
function Login (props) {
  session.login()
}
```

In App.js Create Logout Component

``` js
function Logout (props) {
  session.logout()
  return <Redirect to="/login" />
}
```

In App.js Create Callback Commponent

``` js
function Callback (props) {
  session.handleAuthentication()
  return <h1>Loading...</h1>
}
```

In app.js create a secure higher order component

``` js
function secure (Component) {
  return function (props) {
    if (not(session.isAuthenticated())) {
      return <Redirect to="/login" />
    }
    return <Component {...props} />
  }
}
```

Now that we have our secure function, we can wrap our Todos Component to make sure the user must be logged in to access.

``` js
<Route exact path="/" component={secure(Todos)} />
```

In pages/todos.js add a logout Link just above the `h1`

``` js
<Link className="fr ba br2 pa2 ma2 link dim black" to="/logout">Logout</Link>
```

> Be sure to import it from react-router-dom

``` js
import { Link } from 'react-router-dom'
```

Connect our app to auth0 as a single page application client

In poi.config.js add the following env - you can replace these with you own settings from your auth0 account

``` js
module.exports = (options, req) => ({
  jsx: 'react',
  env: {
    AUTH0_DOMAIN: 'twilson63.auth0.com',
    CLIENTID: 'QXxTJOT2uSRe14nWfznOOO2d6D4MEuI2',
    AUDIENCE: 'http://localhost:8080'
  }
})
```

* Create a Database

``` bash
roo db add todos
```

> Note key and secret

* Setup MicroService

create a new folder

```
mkdir envoy
touch .env
touch auth0-plugin.js
npm init -y
npm install cloudant-envoy --save
npm install run.env --save
npm install express-jwt --save
npm install jwks-rsa --save
npm install ramda --save
```

* Add Auth0 Plugin

in auth0-plugin.js

``` js
/**
 * Auth0 Plugin for Cloudant Envoy
 *
 * This plugin will enable Cloudant Envoy to become
 * an Auth0 Secure API using JWT Tokens.
 *
 * All you need to do is set a couple of ENV Variables
 * npm install this plugin and start envoy.
 *
 * AUTH0_JWKS_URI
 * AUTH0_AUDIENCE
 * AUTH0_ISSUER
 *
 */
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

const noop = (cb) => {
  if (cb) { return cb(null) }
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
```

* setup .env file

``` bash
PORT=5000
COUCH_HOST=https://[KEY]:[SECRET]@[HOST]
ENVOY_DATABASE_NAME=todos
ENVOY_AUTH=./auth0.js
AUTH0_JWKS_URI=https://twilson63.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=http://localhost:8080
AUTH0_ISSUER=https://twilson63.auth0.com/
DEBUG=true
```


* Deploy

```
now -E
```

* Add Sync to todos app

poi.config.js

```
module.exports = (options, req) => ({
  jsx: 'react',
  env: {
    ...
    API: 'https://envoy-bvwdzqfxqc.now.sh'
  }
})
```


dal.js

``` js

export const init = (dbName, token) => {
  db = PouchDB(dbName)
  sync(token)
  watchChanges(dbName)
}


export const cancelSync = () => {
  if (cloud) {
    cloud.cancel()
  }
}

export const sync = (token) => {
  if (cloud) {
    cloud.cancel()
  }

  if (token) {
    const HTTPPouch = PouchDB.defaults({
      prefix: process.env.API,
      ajax: {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    })

    const remote = HTTPPouch('todos')
    window.remoteDb = remote
    cloud = PouchDB.sync(db, remote, {live: true, retry:true})
  }
}

```

Activate init and cancel sync in auth.js

``` js
import { init, cancelSync } from './dal'
```

``` js
function setSession (authResult) {
  ...
  // set database and replication
  init(authResult.idTokenPayload.sub, authResult.accessToken)

  // navigate to the home route
  history.replace('/')
}
```

``` js
function logout () {
  cancelSync()

  ...
}
```

In index.js - get token on init

``` js
// init data
const token = window.localStorage.getItem('access_token')
if (token) {
  init(token)
}
```


---

Lets deploy our envoy service

```
cd envoy
now -E
```

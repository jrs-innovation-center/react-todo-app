import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { not } from 'ramda'

import history from './history'

import auth from './auth'
const session = auth()

import Todos from './pages/todos'

export default () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={secure(Todos)} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/callback" component={Callback} />
    </Switch>
  </Router>
)

function secure(Component) {
  return function(props) {
    if (not(session.isAuthenticated())) {
      return <Redirect to="/login" />
    }
    const dbName = window.localStorage.getItem('sub')
    const token = window.localStorage.getItem('access_token')

    return <Component dbName={dbName} token={token} {...props} />
  }
}

function Login(props) {
  session.login()
}

function Logout(props) {
  session.logout()
  return <Redirect to="/login" />
}

function Callback(props) {
  session.handleAuthentication()
  return <h1>Loading...</h1>
}

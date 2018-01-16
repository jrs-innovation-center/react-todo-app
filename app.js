import React from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import history from './history'
import { not } from 'ramda'
import Todos from './pages/todos'
import auth from './auth'
const session = auth()

export default () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={secure(Todos)} />
      <Route path="/login" component={Login} />
      <Route path="/callback" component={Callback} />
      <Route path="/logout" component={Logout} />
    </Switch>
  </Router>
)

function secure(Component) {
  return function(props) {
    if (not(session.isAuthenticated())) {
      return <Redirect to="/login" />
    }
    const { dbName, token } = session.credentials()
    return <Component dbName={dbName} token={token} {...props} />
  }
}

function Login(props) {
  session.login()
}

function Callback(props) {
  session.handleAuthentication()
  return <h1>Loading...</h1>
}

function Logout(props) {
  session.logout()
  return <Redirect to="/login" />
}

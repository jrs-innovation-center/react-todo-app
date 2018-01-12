import React from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import history from './history'

import Todos from './pages/todos'

import auth from './auth'

const appAuth = auth()

function handleAuthentication(nextState) {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
  appAuth.handleAuthentication()
  }

}

export default () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={props => {
        return <Todos isAuthenticated={appAuth.isAuthenticated} {...props} />
      
      }} />
      <Route path="/login" component={props => {
        appAuth.login()
      }} />
      <Route path="/logout" component={props => {
        appAuth.logout()
        return <Redirect to="/login" />
      }} />
      <Route path="/callback" component={props => {
        handleAuthentication(props)
        return <h1>Loading...</h1>
      }} />
    </Switch>
  </Router>
)

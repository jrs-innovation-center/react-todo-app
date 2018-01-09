import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import history from './history'

import Login from './pages/login'
import Signup from './pages/signup'
import Todos from './pages/todos'

export default () => (
  <Router history={history}>
    <Switch>
      <Route path="/todos" component={Todos} />
      <Route exact path="/" component={Login} />
      <Route path="/signup" component={Signup} />
    </Switch>
  </Router>
)

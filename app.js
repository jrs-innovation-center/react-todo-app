import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import history from './history'

import Todos from './pages/todos'

export default () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Todos} />
    </Switch>
  </Router>
)

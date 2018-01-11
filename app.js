import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Login from './pages/login'
import Signup from './pages/signup'
import Todos from './pages/todos'

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={Todos} />
      <Route exact path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
    </Switch>
  </BrowserRouter>
)

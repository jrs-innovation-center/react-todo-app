import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import { pluck } from 'ramda'

import { watchChanges } from './dal'

import 'tachyons'
import 'todomvc-app-css/index.css'

import App from './app'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)

watchChanges('todos')

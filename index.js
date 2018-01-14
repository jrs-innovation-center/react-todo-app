import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import { pluck, and } from 'ramda'

import { init } from './dal'

import 'tachyons'
import 'todomvc-app-css/index.css'

import App from './app'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)

// init data
const dbName = window.localStorage.getItem('sub')
const token = window.localStorage.getItem('access_token')
if (and(dbName, token)) {
  init(dbName, token)
}

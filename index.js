import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import { pluck } from 'ramda'

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
init()

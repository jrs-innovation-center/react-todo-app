import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import { pluck } from 'ramda'

import PouchDB from 'pouchdb-browser'
const db = PouchDB('todos')

import 'tachyons'
import 'todomvc-app-css/index.css'

import App from './app'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)

db.changes({ live: true, limit: 1, include_docs: true }).on('change', chg => {
  if (chg.deleted) {
    return store.dispatch({
      type: 'REMOVE_TODO',
      payload: chg.doc
    })
  }
  store.dispatch({
    type: 'UPSERT_TODO',
    payload: chg.doc
  })
})

import PouchDB from 'pouchdb-browser'
import upsert from 'pouchdb-upsert'
PouchDB.plugin(upsert)
import store from './store'

let feed = null
let cloud = null

export const db = username => {
  return PouchDB(username)
}

export const sync = (username, password) => {
  if (cloud) { cloud.cancel() }
  cloud = PouchDB.sync(username, `http://${username}:${password}@localhost:5000/todos`, { live: true, retry: true})
}

export const watchChanges = (username) => {
  if (feed) { feed.cancel() }

  feed = PouchDB(username).changes({ live: true, limit: 1, include_docs: true }).on('change', chg => {
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
}

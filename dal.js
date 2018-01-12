import PouchDB from 'pouchdb-browser'
import upsert from 'pouchdb-upsert'
PouchDB.plugin(upsert)
import store from './store'
import { replace } from 'ramda'

let feed = null
let cloud = null
let local = null

export const init = (dbName, token) => {
  local = PouchDB(dbName)
  sync(token)
  watchChanges(local)
}

export const db = () => {
  return local
}


const sync = (token) => {
  if (cloud) {
    cloud.cancel()
  }
  const HTTPPouch = PouchDB.defaults({
    prefix: 'http://localhost:5000',
    ajax: {
      skipSetup: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })

  const remote = HTTPPouch('todos')
  window.remoteDb = remote
  cloud = PouchDB.sync(local, remote, {live: true, retry:true})
}

const watchChanges = db => {
  // unsubscribe to feed
  if (feed) {
    feed.cancel()
  }
  feed = db.changes({ live: true, limit: 1, include_docs: true })

  feed.on('change', chg => {
    console.log('chg', chg)
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

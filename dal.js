import PouchDB from 'pouchdb-browser'
//import upsert from 'pouchdb-upsert'
//import envoy from './envoy-plugin'

PouchDB.plugin(require('pouchdb-upsert'))
PouchDB.plugin(require('./envoy-plugin'))

import store from './store'
import { not, merge, pluck } from 'ramda'

let db = null
let feed = null
let remote = null

export const init = (dbName, token) => {
  db = PouchDB(dbName)
  watchChanges()

  sync(token)
}

export const cancelSync = () => {
  if (remote) {
    remote = null
  }
}

export const sync = async token => {
  if (token) {
    const HTTPPouch = PouchDB.defaults({
      prefix: process.env.API,
      ajax: {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    })
    remote = HTTPPouch('todos')
  }

  const summary = await db.pull(remote)

  db.allDocs({ include_docs: true }).then(res => {
    const docs = pluck('doc', res.rows)
    store.dispatch({
      type: 'SET_TODOS',
      payload: docs
    })
  })
}

export const upsert = (id, data) => {
  return db.upsert(id, doc => {
    return merge(doc, data)
  })
}

export const remove = async id => {
  const doc = await db.get(id)
  return await db.remove(doc)
}

export const watchChanges = () => {
  // unsubscribe to feed
  if (feed) {
    feed.cancel()
  }
  feed = db.changes({ live: true, limit: 1, include_docs: true })

  feed.on('change', chg => {
    db.push(remote).then(res => console.log('REMOTE PUSH', res))
    if (chg.deleted) {
      // remote
      //   .remove(chg.doc)
      //   .then(res => console.log('remove', res))
      //   .catch(err => console.log('remove-error', err))
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

import PouchDB from 'pouchdb-browser'
import upsert from 'pouchdb-upsert'
PouchDB.plugin(upsert)
import store from './store'
import { replace, pluck } from 'ramda'

let feed = null
let cloud = null
let local = null

export const init = (dbName, token) => {
  local = PouchDB(dbName)
  sync(token)
  initChanges(local).then(res => {
      watchChanges(local)
  })

}

export const db = () => {
  return local
}

export const cancelSync = () => {
  if (cloud) {
    cloud.cancel()
  }
}


const sync = (token) => {
  if (cloud) {
    cloud.cancel()
  }

  if (token) {
    const HTTPPouch = PouchDB.defaults({
      prefix: 'http://localhost:5000',
      ajax: {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    })

    const remote = HTTPPouch('todos')
    window.remoteDb = remote
    cloud = PouchDB.sync(local, remote, {live: true, retry:true})
  }
}

const initChanges = async db => {

  const docs = await db.allDocs({include_docs: true}).then(res => {
    return pluck('doc', res.rows)
  })
  store.dispatch({
    type: 'SET_TODOS',
    payload: docs
  })
  return Promise.resolve({ok: true})
}

const watchChanges = db => {
  // unsubscribe to feed
  if (feed) {
    feed.cancel()
  }
  feed = db.changes({ live: true, limit: 1, include_docs: true })

  feed.on('change', chg => {
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

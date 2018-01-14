import PouchDB from 'pouchdb-browser'

PouchDB.plugin(require('pouchdb-upsert'))
PouchDB.plugin(require('./envoy-plugin'))

import store from './store'
import { not, merge, pluck } from 'ramda'

let db = null
let feed = null
let remote = null
let upstream = null

const setRemoteDb = token =>
  PouchDB(process.env.REMOTE_DB, {
    prefix: process.env.API,
    ajax: {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
  })

export const init = (dbName, token) => {
  /**
  prevent memory leakes ....
  */
  if (db) {
    db = null
  }
  if (remote) {
    remote = null
  }

  if (feed) {
    feed.cancel()
  }

  if (upstream) {
    upstream.cancel()
  }

  db = PouchDB(dbName)
  remote = setRemoteDb(token)

  // send changes upstream live
  upstream = db.replicate.to(remote, { live: true, retry: true })

  // get changes downstream
  sync()

  return watchChanges()
}

export const sync = () => {
  return db.pull(remote)
}

export const allDocs = () =>
  db.allDocs({ include_docs: true }).then(res => pluck('doc', res.rows))

export const upsert = (id, data) => {
  return db.upsert(id, doc => {
    return merge(doc, data)
  })
}

export const remove = async id => {
  const doc = await db.get(id)
  return await db.remove(doc)
}

const watchChanges = () => {
  feed = db.changes({ live: true, limit: 1, include_docs: true })
  feed.on('change', chg => {
    if (chg.deleted) {
      return undefined
    }
  })
  return feed
}

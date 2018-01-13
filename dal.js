import PouchDB from 'pouchdb-browser'
import upsert from 'pouchdb-upsert'
PouchDB.plugin(upsert)
import store from './store'
import { not, merge } from 'ramda'

let db = null
let feed = null

export const init = (dbName, token) => {
  db = PouchDB('todos')
  watchChanges('todos')
}

export const addTodoItem = doc => {
  return db.post(doc)
}

export const toggleComplete = id => {
  return db.upsert(id, (doc) => {
    return merge(doc, {
      completed: not(doc.completed)
    })
  })
}

export const removeTodo = async id => {
  const doc = await db.get(id)
  return await db.remove(doc)
}

export const watchChanges = db => {
  // unsubscribe to feed
  if (feed) {
    feed.cancel()
  }
  feed = PouchDB(db).changes({ live: true, limit: 1, include_docs: true })

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

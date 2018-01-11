import PouchDB from 'pouchdb-browser'
import upsert from 'pouchdb-upsert'
PouchDB.plugin(upsert)
import store from './store'

let feed = null

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

//import utils from 'pouchdb-utils'
const utils = require('pouchdb-utils')
const {
  pipeP,
  invoker,
  prop,
  reduce,
  map,
  path,
  assoc,
  keys,
  compose,
  pluck,
  flatten,
  tap
} = require('ramda')

// pure functions
const buildDiff = (diffs, row) => assoc(row.id, [row.value.rev], diffs)
const toId = map(id => ({ id }))
const getChangedDocs = compose(
  pluck('ok'),
  flatten,
  pluck('docs'),
  prop('results')
)

export const pull = utils.toPromise(function(remote) {
  // keep a reference for 'this'
  var target = this
  // PouchDB
  var PouchDB = this.constructor

  // sanity check
  if (!remote) {
    throw 'remote must be a PouchDB instance or a url'
  }

  // if this is a url
  if (typeof remote === 'string') {
    remote = new PouchDB(remote)
  }

  // create temporary database
  const dbName = 'envoytemp' + new Date().getTime()
  const temp = new PouchDB(dbName)

  const bulkGet = docs => remote.bulkGet({ docs, revs: true })
  const addDocsToTemp = docs => temp.bulkDocs({ docs, new_edits: false })
  const replicateToTarget = () => target.replicate.from(temp)

  window.remoteDb = remote
  // This works great, but does not handle delete documents

  return pipeP(
    invoker(0, 'allDocs'),
    prop('rows'),
    reduce(buildDiff, {}),
    diffs => target.revsDiff(diffs),
    keys,
    toId,
    bulkGet,
    getChangedDocs,
    addDocsToTemp,
    replicateToTarget,
    tap(() => temp.destroy())
  )(remote).catch(e => {
    console.log('envoy', e)
    temp.destroy()
  })
})

// push is an alias for 'replicate.to'
export const push = utils.toPromise(function(remote) {
  var target = this
  return target.replicate.to(remote)
})

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(exports)
}

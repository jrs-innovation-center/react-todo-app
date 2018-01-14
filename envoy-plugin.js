//import utils from 'pouchdb-utils'
const utils = require('pouchdb-utils')
const R = require('ramda')

// pure functions
const buildDiff = (diffs, row) => R.assoc(row.id, [row.value.rev], diffs)
const toId = R.map(id => ({ id }))
const getChangedDocs = R.compose(
  R.pluck('ok'),
  R.flatten,
  R.pluck('docs'),
  R.prop('results')
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

  return R.pipeP(
    R.invoker(0, 'allDocs'),
    R.prop('rows'),
    R.reduce(buildDiff, {}),
    diffs => target.revsDiff(diffs),
    R.keys,
    toId,
    bulkGet,
    getChangedDocs,
    addDocsToTemp,
    replicateToTarget,

    R.tap(() => temp.destroy())
  )(remote).catch(e => {
    console.log('envoy', e)
    temp.destroy()
  })
})

/* istanbul ignore next */
// if (typeof window !== 'undefined' && window.PouchDB) {
//   window.PouchDB.plugin(exports)
// }

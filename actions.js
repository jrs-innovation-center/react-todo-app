import PouchDB from 'pouchdb-browser'
import { merge, not } from 'ramda'

const db = PouchDB('todos')

export const addTodo = async (dispatch, getState) => {
  const todo = getState().todo
  console.log('add todo')
  await db.post(todo)
  dispatch({ type: 'CLEAR_TODO' })
}

export const toggle = id => async (dispatch, getState) => {
  const doc = await db.get(id)
  db.put(
    merge(doc, {
      completed: not(doc.completed)
    })
  )
}

export const remove = id => async dispatch => {
  const doc = await db.get(id)
  db.remove(doc)
}

import { merge, not } from 'ramda'
import { db } from './dal'

export const addTodo = async (dispatch, getState) => {
  const {todo, user} = getState()
  await db(user.username).post(todo)
  dispatch({ type: 'CLEAR_TODO' })
}

export const toggle = id => async (dispatch, getState) => {
  const { user } = getState()
  const todoDb = db(user.username)
  const doc = await todoDb.get(id)
  todoDb.put(
    merge(doc, {
      completed: not(doc.completed)
    })
  )
}

export const remove = id => async (dispatch, getState) => {
  const { user } = getState()
  const todoDb = db(user.username)
  const doc = await todoDb.get(id)
  todoDb.remove(doc)
}

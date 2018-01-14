import { merge, not, find, propEq } from 'ramda'
import { upsert, remove, sync } from './dal'

export const refresh = () => {
  sync()
}

export const addTodo = async (dispatch, getState) => {
  const todo = getState().todo
  todo._id = new Date().toISOString()
  await upsert(todo._id, todo)
  dispatch({ type: 'CLEAR_TODO' })
}

export const toggle = id => async (dispatch, getState) => {
  const todo = find(propEq('_id', id), getState().todos)
  todo.completed = not(todo.completed)
  return await upsert(id, todo)
}

export const removeTodo = id => async dispatch => {
  return await upsert(id, { deleted: true })
}

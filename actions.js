import { merge, not, find, propEq } from 'ramda'
import { upsert, remove, sync, allDocs } from './dal'

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

export const loadTodos = () => dispatch => {
  allDocs().then(docs => {
    dispatch({
      type: 'SET_TODOS',
      payload: docs
    })
  })
}

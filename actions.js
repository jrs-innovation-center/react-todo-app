import { merge, not } from 'ramda'

import { addTodoItem, toggleComplete, removeTodo } from './dal'

export const addTodo = async (dispatch, getState) => {
  const todo = getState().todo
  await addTodoItem(todo)
  dispatch({ type: 'CLEAR_TODO' })
}

export const toggle = id => async () => {
  return await toggleComplete(id)
}

export const remove = id => async dispatch => {
  return await removeTodo(id)
}

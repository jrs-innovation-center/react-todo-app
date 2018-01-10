import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { not, append, reject, propEq, merge } from 'ramda'

export default createStore(
  combineReducers({
    todos,
    todo,
    user
  }),
  applyMiddleware(thunk)
)

function user(state = { username: '', password: '' }, action) {
  switch (action.type) {
    case 'CHG_USERNAME':
      return merge(state, { username: action.payload })
    case 'CHG_PASSWORD':
      return merge(state, { password: action.payload })
    case 'SET_USER':
      return action.payload
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'REMOVE_TODO':
      return reject(propEq('_id', action.payload._id), state)
    case 'UPSERT_TODO':
      return append(
        action.payload,
        reject(propEq('_id', action.payload._id), state)
      )
    default:
      return state
  }
}

function todo(
  state = {
    description: '',
    completed: false
  },
  action
) {
  switch (action.type) {
    case 'CHG_DESCRIPTION':
      return merge(state, { description: action.payload })
    case 'CLEAR_TODO':
      return {
        description: '',
        completed: false
      }
    case 'TOGGLE_DONE':
      return merge(state, { completed: not(state.completed) })
    default:
      return state
  }
}

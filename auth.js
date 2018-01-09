import PouchDB from 'pouchdb-browser'
import history from './history'
import { merge } from 'ramda'

const db = PouchDB('todos')

export const login = async (dispatch, getState) => {
  const user = getState().user
  const result = await fetch(`http://localhost:5000/_auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  if (result.error) {
    return dispatch({ type: 'LOGIN_ERROR', payload: result.error })
  }

  db.sync(`http://${user.username}:${user.password}@localhost:5000/todos`)

  // set current user
  await db.put('_local/user', user)

  dispatch({
    type: 'SET_USER',
    payload: merge(user, { loggedIn: true, password: '' })
  })
  history.push('/todos')
}

export const signup = async (dispatch, getState) => {
  const user = getState().user
  console.log('signing up ', user)
  const result = await fetch(`http://localhost:5000/_adduser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })

  if (result.error) {
    return dispatch({ type: 'SIGNUP_ERROR', payload: result.error })
  }

  db.sync(`http://${user.username}:${user.password}@localhost:5000/todos`)

  // set current user
  await db.put('_local/user', user)

  dispatch({
    type: 'SET_USER',
    payload: merge(user, { loggedIn: true, password: '' })
  })
  history.push('/todos')
}

export const logout = async dispatch => {}

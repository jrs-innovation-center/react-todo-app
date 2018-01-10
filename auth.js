import history from './history'
import { merge } from 'ramda'
import { db, sync, watchChanges } from './dal'
export const login = async (dispatch, getState) => {
  const user = getState().user

  const result = await fetch(`http://localhost:5000/_auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: user.username,
      password: user.password
    })
  }).then(res => res.json())
  if (result.error) {
    return dispatch({ type: 'LOGIN_ERROR', payload: result.error })
  }

  user.loggedIn = true
  // set current user
  await db(user.username).upsert('_local/user', doc => user)
  watchChanges(user.username)
  sync(user.username, user.password)

  dispatch({
    type: 'SET_USER',
    payload: merge(user, { password: '' })
  })
  history.push('/todos')
}

export const signup = async (dispatch, getState) => {
  const user = getState().user

  const result = await fetch(`http://localhost:5000/_adduser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  }).then(res => res.json()).catch(err => {
    console.log(err)
    return {error: err.message }
  })

  if (result.error) {
    return dispatch({ type: 'SIGNUP_ERROR', payload: result.error })
  }

  await db(user.username).upsert('_local/user', doc => user)
  watchChanges(user.username)

  sync(user.username, user.password)

  user.loggedIn = true

  dispatch({
    type: 'SET_USER',
    payload: merge(user, { password: '' })
  })

  history.push('/todos')
}

export const logout = async dispatch => {
  
  dispatch({
    type: 'SET_USER',
    payload: {
      username: '',
      password: ''
    }
  })
  history.push('/')
}

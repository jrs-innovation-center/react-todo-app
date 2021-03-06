import auth0 from 'auth0-js'
import history from './history'
import { map, __, and, has } from 'ramda'

export default function() {
  const a0 = new auth0.WebAuth({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.CLIENTID,
    redirectUri: window.location.origin + '/callback',
    audience: process.env.AUDIENCE,
    responseType: 'token id_token',
    scope: 'openid'
  })

  return {
    login,
    handleAuthentication,
    logout,
    isAuthenticated
  }

  function handleAuthentication() {
    a0.parseHash((err, authResult) => {
      const has2 = has(__, authResult)
      if (err) {
        return console.log(err)
      }

      if (and(has2('accessToken'), has2('idToken'))) {
        setSession(authResult)
        history.replace('/')
      }
    })
  }

  function setSession(authResult) {
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    const setItem = ([key, value]) => localStorage.setItem(key, value)

    map(setItem, [
      ['access_token', authResult.accessToken],
      ['id_token', authResult.idToken],
      ['expires_at', expiresAt],
      ['sub', authResult.idTokenPayload.sub]
    ])

    // navigate to the home route
    history.replace('/')
  }

  function logout() {
    const rm = k => localStorage.removeItem(k)
    map(rm, ['access_token', 'id_token', 'expires_at'])
  }

  function isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }

  function login() {
    a0.authorize()
  }
}

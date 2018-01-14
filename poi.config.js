module.exports = (options, req) => ({
  jsx: 'react',
  env: {
    AUTH0_DOMAIN: 'twilson63.auth0.com',
    CLIENTID: 'QXxTJOT2uSRe14nWfznOOO2d6D4MEuI2',
    AUDIENCE: 'http://localhost:8080',
    API: 'https://envoy-example.now.sh/',
    REMOTE_DB: 'todos'
  }
})

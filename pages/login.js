import React from 'react'
import { connect } from 'react-redux'
import { login } from '../auth'
import { Link } from 'react-router-dom'
import Username from '../components/username'
import Password from '../components/password'


const Login = props => (
  <section className="todoapp">
    <header className="header">
      <h1>Login</h1>
    </header>
    <form className="pa4" onSubmit={props.doLogin}>
      <Username value={props.user.username} onChange={props.chgUsername} />
      <Password value={props.user.password} onChange={props.chgPassword} />
      <div className="pa2 mb2">
        <button className="button ba pa2 br2 fr">Login</button>
        <Link className="link fr mr3 mt2" to="/signup">
          Sign Up
        </Link>
      </div>
    </form>
  </section>
)

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({
  chgUsername: e => {
    dispatch({ type: 'CHG_USERNAME', payload: e.target.value })
  },
  chgPassword: e => {
    dispatch({ type: 'CHG_PASSWORD', payload: e.target.value })
  },
  doLogin: e => {
    e.preventDefault()
    dispatch(login)
  }
})
const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Login)

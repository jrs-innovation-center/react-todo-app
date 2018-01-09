import React from 'react'
import { connect } from 'react-redux'
import { signup } from '../auth'
import Username from '../components/username'
import Password from '../components/password'

const Signup = props => (
  <section className="todoapp">
    <header className="header">
      <h1>Signup</h1>
    </header>
    <form className="pa4" onSubmit={props.doSignup}>
      <Username value={props.user.username} onChange={props.chgUsername} />
      <Password value={props.user.password} onChange={props.chgPassword} />
      <div className="pa2 mb2">
        <button className="button ba pa2 br2 fr">Sign Up</button>
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
  doSignup: e => {
    e.preventDefault()
    dispatch(signup)
  }
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Signup)

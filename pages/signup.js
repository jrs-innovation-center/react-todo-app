import React from 'react'

export default props => (
  <section className="todoapp">
    <header className="header">
      <h1>Signup</h1>
    </header>
    <form className="pa4">
      <div className="pa2">
        <label className="db mb2">Username</label>
        <input type="text" />
      </div>
      <div className="pa2">
        <label className="db mb2">Password</label>
        <input type="password" />
      </div>
      <div className="pa2">
        <label className="db mb2">Confirm</label>
        <input type="password" />
      </div>
      <div className="pa2 mb2">
        <button className="button ba pa2 br2 fr">Sign Up</button>
      </div>
    </form>
  </section>
)

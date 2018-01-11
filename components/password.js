import React from 'react'

export default props => (
  <div className="pa2">
    <label className="db mb2">Username</label>
    <input type="password" value={props.value} onChange={props.onChange} />
  </div>
)

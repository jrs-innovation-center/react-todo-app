import React from 'react'

export default props => (
  <div className="pa2">
    <label className="db mb2">Username</label>
    <input type="text" value={props.value} onChange={props.onChange} />
  </div>
)

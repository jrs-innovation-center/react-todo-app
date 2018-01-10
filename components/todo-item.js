import React from 'react'

export default ({ description, completed, onToggle, remove }) => (
  <li className={completed ? 'completed' : null}>
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={completed}
        onChange={onToggle}
      />
      <label>{description}</label>
      <button className="destroy" onClick={remove} />
    </div>
    <input className="edit" value={description} onChange={e => null} />
  </li>
)

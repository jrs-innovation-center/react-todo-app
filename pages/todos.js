import React from 'react'
import TodoItem from '../components/todo-item'
import { map } from 'ramda'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { addTodo, toggle, remove } from '../actions'
import { logout } from '../auth'

const Todos = props => {
  if (!props.user.loggedIn) {
    return <Redirect to="/" />
  }
  return (
    <section className="todoapp">
      <header className="header">
        <button className="button ba br2 pa2 fr ma1 hover-bg-black hover-white" onClick={props.logout}>Logout</button>
        <h1>todos</h1>
        <form onSubmit={props.addTodo}>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            value={props.todo.description}
            onChange={props.change}
          />
        </form>
      </header>
      <section className="main">
        <input className="toggle-all" type="checkbox" />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {map(
            item => (
              <TodoItem
                remove={props.removeTodo(item._id)}
                onToggle={props.toggleComplete(item._id)}
                key={item._id}
                {...item}
              />
            ),
            props.todos
          )}
        </ul>
      </section>
      <footer className="footer" style={{ height: '50px' }}>
        <span className="todo-count">
          <strong>{props.todos.length}</strong> item left
        </span>
        <ul className="filters">
          <li>
            <a className="selected" href="#/">
              All
            </a>
          </li>
          <li>
            <a href="#/active">Active</a>
          </li>
          <li>
            <a href="#/completed">Completed</a>
          </li>
        </ul>

        <button className="clear-completed">Clear completed</button>
      </footer>
    </section>
  )
}

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => {
  return {
    change: e => {
      dispatch({ type: 'CHG_DESCRIPTION', payload: e.target.value })
    },
    addTodo: e => {
      e.preventDefault()
      dispatch(addTodo)
    },
    toggleComplete: id => e => {
      dispatch(toggle(id))
    },
    removeTodo: id => e => {
      dispatch(remove(id))
    },
    logout: e => {
      dispatch(logout)
    }
  }
}
const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Todos)

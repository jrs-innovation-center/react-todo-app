import React from 'react'
import TodoItem from '../components/todo-item'
import { map, sortBy, prop, reject } from 'ramda'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { addTodo, toggle, removeTodo, refresh } from '../actions'
const sortByDescription = sortBy(prop('description'))
const Todos = props => (
  <section className="todoapp">
    <header className="header">
      <button
        className="fl ba br2 pa2 ma2 link dim black"
        onClick={props.refresh}
      >
        Refresh
      </button>
      <Link className="fr ba br2 pa2 ma2 link dim black" to="/logout">
        Logout
      </Link>
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

const mapStateToProps = state => {
  return {
    todo: state.todo,
    todos: sortByDescription(reject(prop('deleted'), state.todos))
  }
}
const mapDispatchToProps = dispatch => {
  return {
    refresh: e => {
      dispatch(refresh)
    },
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
      dispatch(removeTodo(id))
    }
  }
}
const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Todos)

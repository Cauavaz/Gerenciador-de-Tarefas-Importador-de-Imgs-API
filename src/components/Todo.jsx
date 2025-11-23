import React from 'react'

export const Todo = ({todo, removeTodo, completeTodos, onEdit}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
     <div className={`todo ${todo.isCompleted ? 'complete' : ''}`} style={{textDecoration: todo.isCompleted ? "line-through" : "" }}>
        <div className="content">
          <h3>{todo.text}</h3>
          <p className='category'>Categoria: ({todo.category})</p>
          {todo.createdAt && (
            <p className='date'>Criado em: {formatDate(todo.createdAt)}</p>
          )}
        </div>
        <div>
          <button className="complete" onClick={() => completeTodos(todo.id)}><i class="fas fa-check"></i></button>
          <button className="edit" onClick={() => onEdit(todo)}>
            <i className="fas fa-pen"></i>
          </button>
          <button className="remove" onClick={() => removeTodo(todo)}>
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
  )
}

export default Todo
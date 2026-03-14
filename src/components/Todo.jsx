import React from 'react'

export const Todo = ({ todo, removeTodo, completeTodos, onEdit, selectionMode, isSelected, onToggleSelect }) => {
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
    <div 
      className={`todo ${todo.isCompleted ? 'complete' : ''} ${selectionMode ? 'selection-mode' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => selectionMode && onToggleSelect(todo.id)}
    >
      {selectionMode && (
        <div className="checkbox-container">
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={() => onToggleSelect(todo.id)}
            onClick={(e) => e.stopPropagation()} // Evita que o clique no checkbox dispare o onClick da div
          />
        </div>
      )}
      <div className="content">
        <h3>{todo.text}</h3>
        <p className='category'>Categoria: ({todo.category})</p>
        {todo.createdAt && (
          <p className='date'>Criado em: {formatDate(todo.createdAt)}</p>
        )}
      </div>
      {!selectionMode && (
        <div>
          <button className="complete" onClick={() => completeTodos(todo.id)}><i className="fas fa-check"></i></button>
          <button className="edit" onClick={() => onEdit(todo)}>
            <i className="fas fa-pen"></i>
          </button>
          <button className="remove" onClick={() => removeTodo(todo)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )}
    </div>
  )
}

export default Todo
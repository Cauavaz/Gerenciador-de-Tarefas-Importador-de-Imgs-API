import React, { useState } from 'react';
import Todo from "../Todo";
import TodoForm from "../TodoForm";
import Search from "../Search";

const TarefasView = ({ todos, search, setSearch, removeTodo, completeTodos, addTodo, updateTodo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodo, setDeletingTodo] = useState(null);

  const handleAddTodoSuccess = (value, category) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, value, category);
      setEditingTodo(null);
    } else {
      addTodo(value, category);
    }
    setIsModalOpen(false);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const handleDeleteTodo = (todo) => {
    console.log('Tarefa selecionada para excluir:', todo);
    setDeletingTodo(todo);
  };

  const handleConfirmDelete = () => {
    if (deletingTodo) {
      console.log('Excluindo tarefa:', deletingTodo.id);
      removeTodo(deletingTodo.id);
      setDeletingTodo(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletingTodo(null);
  };

  return (
    <>
      {/* ===== SEARCH & INDICATORS ===== */}
        <div className='flex items-center justify-center'>
              <Search search={search} setSearch={setSearch}/>
              <button onClick={() => {
                setEditingTodo(null);
                setIsModalOpen(true);
              }}>+</button>
        </div>

      {/* ===== TODO LIST ===== */}
      <div className="todo-list">
        {todos.filter((todo) => todo.text.toLowerCase().includes(search.toLowerCase()))
        .map((todo) => (
          <Todo key={todo.id} todo={todo} removeTodo={handleDeleteTodo} completeTodos={completeTodos} onEdit={handleEditTodo}/>
        ))}  
      </div>

      {/* ===== ADD/EDIT TODO MODAL ===== */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>✕</button>
            <TodoForm addTodo={handleAddTodoSuccess} editingTodo={editingTodo}/>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {deletingTodo && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Confirmar Exclusão</h3>
            </div>
            <div className="delete-modal-body">
              <p>Tem certeza que deseja excluir a tarefa:</p>
              <p className="delete-todo-text">"{deletingTodo.text || 'Título não encontrado'}"</p>
              <p className="delete-todo-category">Categoria: {deletingTodo.category || 'Não informada'}</p>
            </div>
            <div className="delete-modal-actions">
              <button type="button" className="btn-cancel" onClick={handleCancelDelete}>
                <i className="fas fa-times"></i> Cancelar
              </button>
              <button type="button" className="btn-delete" onClick={handleConfirmDelete}>
                <i className="fas fa-trash"></i> Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      
    </>
  );
};

export default TarefasView;

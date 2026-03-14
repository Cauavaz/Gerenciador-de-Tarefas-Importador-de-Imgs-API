import React, { useState } from 'react';
import Todo from "../Todo";
import Search from "../Search";
import { showSuccessAlert, showDeleteConfirm, showTaskModal, showBulkDeleteConfirm, showInfoAlert } from "../../utils/sweetAlert";

const TarefasView = ({ todos, search, setSearch, removeTodo, completeTodos, addTodo, updateTodo, removeMultipleTodos }) => {
  const [editingTodo, setEditingTodo] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState([]);

  const handleAddTodo = async () => {
    const result = await showTaskModal();
    if (result) {
      addTodo(result.text, result.category);
    }
  };

  const handleEditTodo = async (todo) => {
    const result = await showTaskModal(todo);
    if (result) {
      updateTodo(todo.id, result.text, result.category);
      showSuccessAlert("Tarefa editada!");
    }
  };

  const handleDeleteTodo = async (todo) => {
    const confirmed = await showDeleteConfirm(todo.text, todo.category);
    if (confirmed) {
      removeTodo(todo.id);
      showSuccessAlert("Tarefa deletada!");
    }
  };

    const handleToggleSelect = (id) => {
    setSelectedTodos(prevSelected => 
      prevSelected.includes(id)
        ? prevSelected.filter(todoId => todoId !== id)
        : [...prevSelected, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedTodos.length === 0) {
      showInfoAlert("Nenhuma tarefa selecionada!");
      return;
    }

    const confirmed = await showBulkDeleteConfirm(selectedTodos.length);
    if (confirmed) {
      removeMultipleTodos(selectedTodos);
      showSuccessAlert(`${selectedTodos.length} tarefas foram deletadas!`);
      setSelectionMode(false);
      setSelectedTodos([]);
    }
  };

  const handleCompleteTodo = (id) => {
    completeTodos(id);
    const todo = todos.find(t => t.id === id);
    if (todo.isCompleted) {
      showSuccessAlert("Tarefa desmarcada!");
    } else {
      showSuccessAlert("Tarefa concluída!");
    }
  };

  return (
    <>
      {/* ===== SEARCH & INDICATORS ===== */}
            <div className='flex items-center justify-between mb-4'>
        <Search search={search} setSearch={setSearch} />
        
        {selectionMode ? (
          <div className="flex items-center gap-2">
            <button onClick={handleBulkDelete} className="btn-bulk-delete">
              <i className="fas fa-trash-alt"></i> Excluir Selecionados ({selectedTodos.length})
            </button>
            <button onClick={() => { setSelectionMode(false); setSelectedTodos([]); }} className="btn-cancel-selection">
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={handleAddTodo} className="btn-add">+</button>
            <button onClick={() => setSelectionMode(true)} className="btn-select">
              Selecionar
            </button>
          </div>
        )}
      </div>

      {/* ===== TODO LIST ===== */}
      <div className="todo-list">
        {todos.filter((todo) => todo.text.toLowerCase().includes(search.toLowerCase()))
        .map((todo) => (
          <Todo 
            key={todo.id} 
            todo={todo} 
            removeTodo={handleDeleteTodo} 
            completeTodos={handleCompleteTodo} 
            onEdit={handleEditTodo}
            selectionMode={selectionMode}
            isSelected={selectedTodos.includes(todo.id)}
            onToggleSelect={handleToggleSelect}
          />
        ))}  
      </div>
    </>
  );
};

export default TarefasView;

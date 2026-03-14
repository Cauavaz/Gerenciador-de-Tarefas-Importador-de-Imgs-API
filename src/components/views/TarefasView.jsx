import React, { useState } from 'react';
import Todo from "../Todo";
import Search from "../Search";
import { showSuccessAlert, showDeleteConfirm, showTaskModal } from "../../utils/sweetAlert";

const TarefasView = ({ todos, search, setSearch, removeTodo, completeTodos, addTodo, updateTodo }) => {
  const [editingTodo, setEditingTodo] = useState(null);

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
      <div className='flex items-center justify-center'>
        <Search search={search} setSearch={setSearch}/>
        <button onClick={handleAddTodo}>+</button>
      </div>

      {/* ===== TODO LIST ===== */}
      <div className="todo-list">
        {todos.filter((todo) => todo.text.toLowerCase().includes(search.toLowerCase()))
        .map((todo) => (
          <Todo key={todo.id} todo={todo} removeTodo={handleDeleteTodo} completeTodos={handleCompleteTodo} onEdit={handleEditTodo}/>
        ))}  
      </div>
    </>
  );
};

export default TarefasView;

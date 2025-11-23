import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children, todos = [] }) => {
  const [filtroSelecionado, setFiltroSelecionado] = useState('todos'); 

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const tarefasPendentes = todos.filter(todo => todo.category === 'Pendente' && !todo.isCompleted);
  const tarefasProgresso = todos.filter(todo => todo.category === 'Progresso' && !todo.isCompleted);
  const tarefasConcluidas = todos.filter(todo => todo.isCompleted);

  const getTarefasFiltradas = () => {
    switch(filtroSelecionado) {
      case 'pendentes':
        return tarefasPendentes;
      case 'progresso':
        return tarefasProgresso;
      case 'concluidas':
        return tarefasConcluidas;
      default:
        return todos;
    }
  };

  // Função para obter tarefas exibidas nas colunas
  const getTarefasParaColunas = () => {
    if (filtroSelecionado === 'todos') {
      return {
        pendentes: tarefasPendentes,
        progresso: tarefasProgresso,
        concluidas: tarefasConcluidas
      };
    } else if (filtroSelecionado === 'pendentes') {
      return {
        pendentes: tarefasPendentes,
        progresso: [],
        concluidas: []
      };
    } else if (filtroSelecionado === 'progresso') {
      return {
        pendentes: [],
        progresso: tarefasProgresso,
        concluidas: []
      };
    } else if (filtroSelecionado === 'concluidas') {
      return {
        pendentes: [],
        progresso: [],
        concluidas: tarefasConcluidas
      };
    }
  };

  // Funções para mudar o filtro
  const filtrarPorPendentes = () => setFiltroSelecionado('pendentes');
  const filtrarPorProgresso = () => setFiltroSelecionado('progresso');
  const filtrarPorConcluidas = () => setFiltroSelecionado('concluidas');
  const mostrarTodas = () => setFiltroSelecionado('todos');

  const value = {
    // Estado
    filtroSelecionado,
    setFiltroSelecionado,
    
    // Dados filtrados
    tarefasPendentes,
    tarefasProgresso,
    tarefasConcluidas,
    getTarefasFiltradas,
    getTarefasParaColunas,
    
    formatDate,
    
    // Funções de filtro
    filtrarPorPendentes,
    filtrarPorProgresso,
    filtrarPorConcluidas,
    mostrarTodas,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext;

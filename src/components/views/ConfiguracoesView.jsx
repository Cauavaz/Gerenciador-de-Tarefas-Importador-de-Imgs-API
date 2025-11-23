import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useDashboardContext } from '../../context/DashboardContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const ConfiguracoesView = () => {
  const {
    filtroSelecionado,
    tarefasPendentes,
    tarefasProgresso,
    tarefasConcluidas,
    getTarefasParaColunas,
    formatDate,
    filtrarPorPendentes,
    filtrarPorProgresso,
    filtrarPorConcluidas,
    mostrarTodas
  } = useDashboardContext();

  // Dados para o gráfico
  const chartData = {
    labels: ['Pendentes', 'Em Progresso', 'Concluídas'],
    datasets: [
      {
        data: [tarefasPendentes.length, tarefasProgresso.length, tarefasConcluidas.length],
        backgroundColor: [
          '#b20606', // Laranja para pendentes
          '#FFA500', // Azul para progresso
          '#1cc236'  // Escuro para concluídas
        ],
        borderColor: [
          '#b20606',
          '#FFA500',
          '#1cc236'
        ],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: 'bold'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                return {
                  text: `${label}: ${value}`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  const tarefasParaColunas = getTarefasParaColunas();

  return (
    <div className="view-content">
    <br></br> <br></br>    
      {/* ===== TASK INDICATORS ===== */}
        <div className="task-indicators">
          <div className={`indicator open-tasks ${filtroSelecionado === 'pendentes' ? 'active' : ''}`} onClick={filtrarPorPendentes}>
            <div className="indicator-image">
              <img src="https://cdn-icons-png.flaticon.com/512/3144/3144464.png" alt="Abertas" style={{display: 'none'}} />
              <div className="indicator-icon"><img src="/img/Pendente.svg" alt="Abertas" /></div>
            </div>
            <div className="indicator-info">
              <div className="indicator-number-pendente">{tarefasPendentes.length}</div>
              <div className="indicator-label">Pendentes</div>
            </div>
          </div>

          <div className={`indicator progresso-tasks ${filtroSelecionado === 'progresso' ? 'active' : ''}`} onClick={filtrarPorProgresso}>
            <div className="indicator-image">
              <img src="https://cdn-icons-png.flaticon.com/512/4315/4315435.png" alt="Total" style={{display: 'none'}} />
              <div className="indicator-icon"><img src="/img/Progresso.svg" alt="Abertas" /></div>
            </div>
            <div className="indicator-info">
              <div className="indicator-number-progresso">{tarefasProgresso.length}</div>
              <div className="indicator-label">Em Progresso</div>
            </div>
          </div>

            <div className={`indicator completed-tasks ${filtroSelecionado === 'concluidas' ? 'active' : ''}`} onClick={filtrarPorConcluidas}>
            <div className="indicator-image">
              <img src="https://cdn-icons-png.flaticon.com/512/5610/5610944.png" alt="Concluídas" style={{display: 'none'}} />
              <div className="indicator-icon"><img src="/img/Concluida.svg" alt="Concluídas" /></div>
            </div>
            <div className="indicator-info">
              <div className="indicator-number-concluida">{tarefasConcluidas.length}</div>
              <div className="indicator-label">Concluídas</div>
            </div>
          </div>

            <div className={`indicator total-tasks ${filtroSelecionado === 'todos' ? 'active' : ''}`} onClick={mostrarTodas}>
            <div className="indicator-image">
              <img src="https://cdn-icons-png.flaticon.com/512/4315/4315435.png" alt="Total" style={{display: 'none'}} />
              <div className="indicator-icon"><img src="/img/Total.svg" alt="Total" /></div>
            </div>
            <div className="indicator-info">
              <div className="indicator-number-total">{tarefasPendentes.length + tarefasProgresso.length + tarefasConcluidas.length}</div>
              <div className="indicator-label">Total</div>
            </div>
          </div>
        </div>
      {/* ===== COLUNAS KANBAN ===== */}
      <div className="kanban-board">
        {/* Coluna 1: Pendentes */}
        <div className="kanban-column column-pendente">
          <div className="column-header">
            <h3 className="column-title">Pendentes</h3>
            <div className="column-count count-pendente">{tarefasParaColunas.pendentes.length}</div>
          </div>
          <div className="column-content">
            {tarefasParaColunas.pendentes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                    <img src="/img/semTask.svg" style={{width: '250px'}}/>
                </div>
                <p className="empty-title">Nenhuma Tarefa encontrada</p>
              </div>
            ) : (
              tarefasParaColunas.pendentes.map(todo => (
                <div key={todo.id} className="task-card task-pendente">
                  <div className="task-content">
                    <h4 className="task-title">{todo.text}</h4>
                    <p className="task-category">Categoria: ({todo.category})</p>
                    {todo.createdAt && (
                      <p className="task-date">Criado em: {formatDate(todo.createdAt)}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Coluna 2: Em Progresso */}
        <div className="kanban-column column-progresso">
          <div className="column-header">
            <h3 className="column-title">Em Progresso</h3>
            <div className="column-count count-progresso">{tarefasParaColunas.progresso.length}</div>
          </div>
          <div className="column-content">
            {tarefasParaColunas.progresso.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <img src="/img/semTask.svg" style={{width: '250px'}}/>
                </div>
                <p className="empty-title">Nenhuma Tarefa encontrada</p>
              </div>
            ) : (
              tarefasParaColunas.progresso.map(todo => (
                <div key={todo.id} className="task-card task-progresso">
                  <div className="task-content">
                    <h4 className="task-title">{todo.text}</h4>
                    <p className="task-category">Categoria: ({todo.category})</p>
                    {todo.createdAt && (
                      <p className="task-date">Criado em: {formatDate(todo.createdAt)}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Coluna 3: Concluídas */}
        <div className="kanban-column column-concluida">
          <div className="column-header">
            <h3 className="column-title">Concluídas</h3>
            <div className="column-count count-concluida">{tarefasParaColunas.concluidas.length}</div>
          </div>
          <div className="column-content">
            {tarefasParaColunas.concluidas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">                  
                  <img src="/img/semTask.svg" style={{width: '250px'}}/>
                </div>
                <p className="empty-title">Nenhuma Tarefa encontrada</p>
              </div>
            ) : (
              tarefasParaColunas.concluidas.map(todo => (
                <div key={todo.id} className="task-card task-concluida">
                  <div className="task-content">
                    <h4 className="task-title task-completed">{todo.text}</h4>
                    <p className="task-category">Categoria: ({todo.category})</p>
                    {todo.createdAt && (
                      <p className="task-date">Criado em: {formatDate(todo.createdAt)}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* ===== GRÁFICO ===== */}
      <div className="chart-section">
        <div className="chart-container">
          <h3 className="chart-title">Distribuição de Tarefas</h3>
          <div className="chart-wrapper">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ConfiguracoesView;
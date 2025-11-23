import styled, { keyframes } from 'styled-components';

// Animações
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Container principal
export const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #F0F0F0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

// Conteúdo principal
export const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  padding: 40px;
  transition: margin-left 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 20px;
  }
`;

// Card Header
export const HeaderCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(190, 251, 0, 0.15);
  margin-bottom: 30px;
  border: 1px solid rgba(196, 224, 111, 0.3);
  text-align: center;
  animation: ${slideIn} 0.5s ease-out;

  h1 {
    color: #278000;
    font-size: 2em;
    font-weight: 600;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
    margin: 0;
  }
`;

// Container da lista de tarefas
export const TodoListContainer = styled.div`
  margin-bottom: 30px;
  max-height: 30vh;
  overflow-y: auto;
  padding: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(190, 251, 0, 0.15);
  border: 1px solid rgba(196, 224, 111, 0.3);
  animation: ${fadeIn} 0.7s ease-out;

  /* Scrollbar personalizado */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #BEFB00;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #BEFB00;
  }
`;

// Card de tarefa individual
export const TodoCard = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 16px rgba(190, 251, 0, 0.12);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(196, 224, 111, 0.2);
  animation: ${slideIn} 0.4s ease-out;

  &:hover {
    box-shadow: 0 8px 24px rgba(190, 251, 0, 0.18);
    transform: translateY(-2px);
    border-color: rgba(190, 251, 0, 0.4);
  }

  &.completed {
    opacity: 0.7;
    background: #f8fdf4;
    border-color: rgba(196, 224, 111, 0.4);
  }

  .content {
    flex: 1;

    p {
      margin: 8px 0;
      color: #555;
      text-decoration: ${props => props.completed ? 'line-through' : 'none'};
    }

    .category {
      font-size: 0.85em;
      color: #999;
      font-style: italic;
    }
  }

  .actions {
    display: flex;
    gap: 8px;
  }
`;

// Card do formulário
export const FormCard = styled.div`
  background: white;
  padding: 28px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(190, 251, 0, 0.15);
  margin-bottom: 40px;
  border: 1px solid rgba(196, 224, 111, 0.3);
  animation: ${fadeIn} 0.8s ease-out;

  h2 {
    margin-bottom: 20px;
    color: #333;
    font-size: 1.3em;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

// Botões estilizados
export const StyledButton = styled.button`
  background: #BEFB00;
  color: #333;
  border: none;
  padding: ${props => props.small ? '8px 12px' : '10px 16px'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-right: 10px;
  font-size: ${props => props.small ? '0.85em' : '1em'};

  &:hover {
    transform: translateY(-2px);
    background: #A8E600;
  }

  &:active {
    transform: translateY(0);
  }

  &.complete {
    background: #BEFB00;
    color: #333;
  }

  &.remove {
    background: #BEFB00;
    color: #333;
  }
`;

// Inputs e selects estilizados
export const StyledInput = styled.input`
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 2px solid #e8f5e8;
  border-radius: 12px;
  width: 100%;
  font-size: 1em;
  transition: all 0.3s ease;
  background: #fafffa;
  color: #2d4a2d;
  font-weight: 400;
  box-shadow: 0 2px 8px rgba(190, 251, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #BEFB00;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(190, 251, 0, 0.2);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #8fb58f;
    font-style: italic;
  }
`;

export const StyledSelect = styled.select`
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 2px solid #e8f5e8;
  border-radius: 12px;
  width: 100%;
  font-size: 1em;
  transition: all 0.3s ease;
  background: #fafffa;
  color: #2d4a2d;
  font-weight: 400;
  box-shadow: 0 2px 8px rgba(190, 251, 0, 0.1);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23278000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: #BEFB00;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(190, 251, 0, 0.2);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #c5f5c5;
  }

  option {
    background: #fafffa;
    color: #2d4a2d;
    padding: 12px;
    border: none;
  }
`;

// Search container
export const SearchContainer = styled.div`
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease-out;

  input {
    width: 100%;
    font-size: 1.05em;
  }
`;

export default {
  AppContainer,
  MainContent,
  HeaderCard,
  TodoListContainer,
  TodoCard,
  FormCard,
  StyledButton,
  StyledInput,
  StyledSelect,
  SearchContainer
};

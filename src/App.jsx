import { useState, useEffect } from 'react'
import Sidebar from "./components/layout/Sidebar"
import Header from "./components/layout/Header"
import TarefasView from "./components/views/TarefasView"
import EstatisticasView from "./components/views/EstatisticasView"
import ConfiguracoesView from "./components/views/ConfiguracoesView"
import { DashboardProvider } from "./context/DashboardContext"
import SearchImg from "./components/views/Components/SearchImg"
import ImageGrid from "./components/imageGrid"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "./App.css"

function App() {
  const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
  const PEXELS_API_URL = "https://api.pexels.com/v1/search";

  console.log("API Key:", PEXELS_API_KEY);
  console.log("All env vars:", import.meta.env);

  const [images, setImages] = useState(() => {
    const savedImages = localStorage.getItem('customImages');
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("nature");
  const [page, setPage] = useState(1);

  const fetchImages = async (searchQuery = "nature", pageNum = 1) => {
    if(!PEXELS_API_KEY){
      setError("API key not found");
      console.log("API Key not found:", PEXELS_API_KEY);
      return;
    }
    
    // Controla qual loading mostrar
    if(pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try{
      const response = await fetch(
        `${PEXELS_API_URL}?query=${encodeURIComponent(
          searchQuery
        )}&per_page=20&page=${pageNum}`,
      {
        method: 'GET',
        headers: {
          'Authorization': PEXELS_API_KEY,
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      }
    );

    console.log("Fetch Response status:", response.status);

    if(!response.ok){
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Fetch Data - Total photos:", data.photos?.length);

    if(pageNum === 1){
      // Primeira página: se for busca padrão, mostra customizadas + API, senão só API
      const apiPhotos = data.photos || [];
      
      if(searchQuery === "nature"){
        // Busca padrão: mostra customizadas primeiro
        const savedImages = localStorage.getItem('customImages');
        const customImages = savedImages ? JSON.parse(savedImages) : [];
        const filteredCustom = customImages.filter(img => !apiPhotos.some(api => api.id === img.id));
        setImages([...filteredCustom, ...apiPhotos]);
      } else {
        // Busca específica: mostra apenas resultados da API
        setImages(apiPhotos);
      }
      setPage(1);
    }else{
      // Próximas páginas: adiciona ao final
      setImages((prevImages) => [...prevImages, ...(data.photos || [])]);
      setPage(pageNum);
    }
    
    } catch (error) {
      console.error("Failed to fetch images:", error);
      setError(error.message || "An error occurred while fetching images.")
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    fetchImages(query);
  }, [query]);

  // Salvar apenas imagens customizadas no localStorage com verificação de quota
  useEffect(() => {
    const customImages = images.filter(img => typeof img.id === 'string' && img.id.startsWith('custom_'));
    
    try {
      // Verificar tamanho estimado antes de salvar
      const jsonString = JSON.stringify(customImages);
      const estimatedSize = new Blob([jsonString]).size;
      
      // Limite seguro: aproximadamente 4MB (localStorage tem limite de ~5-10MB)
      const maxSafeSize = 4 * 1024 * 1024; // 4MB
      
      if (estimatedSize > maxSafeSize) {
        console.warn('Imagens customizadas muito grandes, removendo as mais antigas...');
        
        // Remover imagens mais antigas até ficar dentro do limite
        const trimmedImages = [...customImages];
        while (new Blob([JSON.stringify(trimmedImages)]).size > maxSafeSize && trimmedImages.length > 0) {
          trimmedImages.shift(); // Remove a imagem mais antiga
        }
        
        localStorage.setItem('customImages', JSON.stringify(trimmedImages));
        
        // Avisar o usuário
        if (trimmedImages.length < customImages.length) {
          alert(`Espaço insuficiente. ${customImages.length - trimmedImages.length} imagens antigas foram removidas para liberar espaço.`);
        }
      } else {
        localStorage.setItem('customImages', JSON.stringify(customImages));
      }
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Erro de quota do localStorage:', error);
        
        // Limpar completamente as imagens customizadas em caso de erro grave
        localStorage.removeItem('customImages');
        alert('Espaço de armazenamento esgotado. Todas as imagens customizadas foram removidas. Tente usar imagens menores.');
        
        // Recarregar a página sem as imagens customizadas
        window.location.reload();
      } else {
        console.error('Erro ao salvar imagens customizadas:', error);
      }
    }
  }, [images]);

  const handleLoadMore = () => {
    fetchImages(query, page + 1);
  };

  const handleAddImage = (newImage) => {
    setImages((prevImages) => [newImage, ...prevImages]);
  };

  const handleDeleteImage = (imageId) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
  };

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    // Dados iniciais com quantidades solicitadas
    return [
      // 10 tarefas pendentes
      { id: 1, text: "Criar funcionalidade X no sistema", category: "Pendente", isCompleted: false, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 2, text: "Ir para a academia", category: "Pendente", isCompleted: false, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 3, text: "Fazer compras no supermercado", category: "Pendente", isCompleted: false, createdAt: new Date().toISOString() },
      { id: 4, text: "Pagar contas do mês", category: "Pendente", isCompleted: false, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 5, text: "Agendar consulta médica", category: "Pendente", isCompleted: false, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 6, text: "Organizar documentos", category: "Pendente", isCompleted: false, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 7, text: "Revisar relatório financeiro", category: "Pendente", isCompleted: false, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 8, text: "Preparar apresentação", category: "Pendente", isCompleted: false, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 9, text: "Atualizar software", category: "Pendente", isCompleted: false, createdAt: new Date().toISOString() },
      { id: 10, text: "Fazer backup dos dados", category: "Pendente", isCompleted: false, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      
      // 20 tarefas em progresso
      { id: 11, text: "Estudar React", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 12, text: "Desenvolver nova API", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 13, text: "Testar integração", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 14, text: "Otimizar performance", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 15, text: "Corrigir bugs críticos", category: "Progresso", isCompleted: false, createdAt: new Date().toISOString() },
      { id: 16, text: "Implementar autenticação", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 17, text: "Design de interface", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 18, text: "Configurar ambiente", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 19, text: "Escrever documentação", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 20, text: "Analisar requisitos", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 21, text: "Prototipar soluções", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 22, text: "Revisar código", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 23, text: "Configurar CI/CD", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 24, text: "Migrar base de dados", category: "Progresso", isCompleted: false, createdAt: new Date().toISOString() },
      { id: 25, text: "Implementar cache", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 26, text: "Criar testes unitários", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 27, text: "Otimizar queries", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 28, text: "Implementar logging", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 29, text: "Configurar monitoramento", category: "Progresso", isCompleted: false, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 30, text: "Refatorar módulos", category: "Progresso", isCompleted: false, createdAt: new Date().toISOString() },
      
      // 30 tarefas concluídas
      { id: 31, text: "Reunião com equipe", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 32, text: "Enviar relatório", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 33, text: "Atualizar documentação", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 34, text: "Planejar sprint", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 35, text: "Configurar ambiente", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 36, text: "Instalar dependências", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 37, text: "Criar repositório", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 38, text: "Configurar Git", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 39, text: "Setup inicial", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 40, text: "Definir arquitetura", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 41, text: "Criar wireframes", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 42, text: "Definir tecnologias", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 43, text: "Configurar servidor", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 44, text: "Criar banco de dados", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 45, text: "Implementar CRUD básico", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 46, text: "Criar componentes base", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 47, text: "Configurar roteamento", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 48, text: "Implementar estados", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 49, text: "Criar layout responsivo", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 50, text: "Adicionar validações", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 51, text: "Implementar filtros", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 52, text: "Criar dashboard", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 53, text: "Adicionar gráficos", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 54, text: "Implementar exportação", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 55, text: "Criar relatórios", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 56, text: "Configurar permissões", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 57, text: "Implementar busca", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 58, text: "Adicionar animações", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 59, text: "Otimizar imagens", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 60, text: "Publicar aplicação", category: "Concluídas", isCompleted: true, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }
    ];
  });

  const [search, setSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [activeView, setActiveView] = useState('tarefas');

  // Títulos dinâmicos para cada view
  const viewTitles = {
    tarefas: "Lista de Tarefas",
    estatisticas: "Galeria de Imagens",
    configuracoes: "Dashboard",
  };

  const addTodo = (text, category) => {
    const newTodo = {
      id: Date.now(),
      text,
      category,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const removeTodo = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const completeTodos = (id) => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const updateTodo = (id, text, category) => {
    const newTodos = todos.map((todo) => 
      todo.id === id ? { ...todo, text, category } : todo
    );
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };
  
  return (
    <div className="app-container">
      <Sidebar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      
      <main className={`main-content ${isMenuOpen ? '' : 'minimized'}`}>
        <div className="app">
          <Header title={viewTitles[activeView]} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

          {/* ===== VIEWS ===== */}
          {activeView === 'tarefas' && (
            <TarefasView 
              todos={todos}
              search={search}
              setSearch={setSearch}
              removeTodo={removeTodo}
              completeTodos={completeTodos}
              addTodo={addTodo}
              updateTodo={updateTodo}
            />
          )}
          
          {activeView === 'estatisticas' && (
            <EstatisticasView 
              images={images}
              loading={loading}
              error={error}
              query={query}
              setQuery={setQuery}
              onLoadMore={handleLoadMore}
              loadingMore={loadingMore}
              onAddImage={handleAddImage}
              onDeleteImage={handleDeleteImage}
              SearchImg={SearchImg}
              ImageGrid={ImageGrid}
            />
          )}
          
          {activeView === 'configuracoes' && (
            <DashboardProvider todos={todos}>
              <ConfiguracoesView />
            </DashboardProvider>
          )}
        </div>
      </main>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;

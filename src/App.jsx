import { useState, useEffect } from 'react'
import Sidebar from "./components/layout/Sidebar"
import Header from "./components/layout/Header"
import TarefasView from "./components/views/TarefasView"
import EstatisticasView from "./components/views/EstatisticasView"
import ConfiguracoesView from "./components/views/ConfiguracoesView"
import { DashboardProvider } from "./context/DashboardContext"
import SearchImg from "./components/views/Components/SearchImg"
import ImageGrid from "./components/imageGrid"
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
    // Dados iniciais apenas se não houver nada no localStorage
    return [
      {
        id: 1,
        text: "Criar funcionalidade X no sistema",
        category: "Pendente",
        isCompleted: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
      },
      {
        id: 2,
        text: "Ir para a academia",
        category: "Progresso",
        isCompleted: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
      },
      {
        id: 3,
        text: "Estudar React",
        category: "Progresso",
        isCompleted: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
      },
      {
        id: 4,
        text: "Fazer compras no supermercado",
        category: "Pendente",
        isCompleted: false,
        createdAt: new Date().toISOString(), // Hoje
      },
      {
        id: 5,
        text: "Reunião com equipe",
        category: "Concluídas",
        isCompleted: true,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 dias atrás
      },
      {
        id: 6,
        text: "Enviar relatório",
        category: "Concluídas",
        isCompleted: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
      },
      {
        id: 7,
        text: "Atualizar documentação",
        category: "Concluídas",
        isCompleted: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
      },
      {
        id: 8,
        text: "Planejar sprint",
        category: "Concluídas",
        isCompleted: true,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 dias atrás
      },
      {
        id: 9,
        text: "Revisar código",
        category: "Concluídas",
        isCompleted: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
      },
      {
        id: 10,
        text: "Configurar ambiente",
        category: "Concluídas",
        isCompleted: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
      }
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
    </div>
  );
}

export default App;

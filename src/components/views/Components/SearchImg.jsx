import { useState } from 'react';
import { Upload } from 'lucide-react';
import { showAddImageModal } from '../../../utils/imageAlert';

const SearchImg = ({ images = [], loading = false, error = null, onSearch = () => {}, onAddImage = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Buscando:', searchTerm);
    onSearch(searchTerm);
  };

  const handleAddImageClick = async () => {
    const result = await showAddImageModal();
    
    if (result) {
      const newImage = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        src: {
          medium: result.preview,
          large: result.preview,
          original: result.preview,
        },
        photographer: result.photographer,
        alt: result.description,
        width: 800,
        height: 600,
      };

      onAddImage(newImage);
    }
  };

  return (
    <div className="mt-8">
      {/* Barra de Busca e Botão de Adicionar */}
      <div className="p-4 bg-white rounded-lg shadow mb-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Procurar imagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                title="Buscar"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
              <button 
                type="button"
                onClick={handleAddImageClick}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center justify-center gap-2"
                title="Adicionar imagem"
              >
                <Upload size={16} />
                <span className="hidden sm:inline">Adicionar</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Status */}
      {loading && <p className="text-center text-gray-600">Carregando imagens...</p>}
      {error && <p className="text-center text-red-600">Erro: {error}</p>}
    </div>
  );
};

export default SearchImg;

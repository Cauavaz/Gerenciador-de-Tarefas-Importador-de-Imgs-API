import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Modal from './Modal';

const SearchImg = ({ images = [], loading = false, error = null, onSearch = () => {}, onAddImage = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [photographer, setPhotographer] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [uploadMode, setUploadMode] = useState('url'); // 'url' ou 'file'
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Buscando:', searchTerm);
    onSearch(searchTerm);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validar se é uma imagem
        if (!file.type.startsWith('image/')) {
          setWarningMessage('Por favor, selecione um arquivo de imagem válido (PNG, JPG, GIF)');
          setShowSizeWarning(true);
          e.target.value = '';
          setImageFile(null);
          setImagePreview('');
          setTimeout(() => setShowSizeWarning(false), 5000);
          return;
        }

        // Validar tamanho do arquivo (500KB = 500 * 1024 bytes)
        const maxSize = 500 * 1024;
        const fileSize = file.size;
        
        if (fileSize > maxSize) {
          // Mostrar aviso se o arquivo for muito grande
          const fileSizeKB = (fileSize / 1024).toFixed(2);
          setWarningMessage(`Imagem muito grande (${fileSizeKB}KB). Limite permitido: 500KB`);
          setShowSizeWarning(true);
          
          // Limpar o input
          e.target.value = '';
          setImageFile(null);
          setImagePreview('');
          
          // Esconder aviso após 5 segundos
          setTimeout(() => {
            setShowSizeWarning(false);
          }, 5000);
          
          return;
        }
        
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            setImagePreview(event.target.result);
            // Mostrar notificação de sucesso quando a imagem é anexada
            setShowSuccessNotification(true);
            setTimeout(() => setShowSuccessNotification(false), 3000);
          } catch (error) {
            setWarningMessage('Erro ao processar a imagem. Tente outro arquivo.');
            setShowSizeWarning(true);
            e.target.value = '';
            setImageFile(null);
            setImagePreview('');
            setTimeout(() => setShowSizeWarning(false), 5000);
          }
        };
        reader.onerror = () => {
          setWarningMessage('Erro ao ler o arquivo. Tente novamente.');
          setShowSizeWarning(true);
          e.target.value = '';
          setImageFile(null);
          setImagePreview('');
          setTimeout(() => setShowSizeWarning(false), 5000);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setWarningMessage('Erro inesperado ao processar o arquivo.');
        setShowSizeWarning(true);
        e.target.value = '';
        setImageFile(null);
        setImagePreview('');
        setTimeout(() => setShowSizeWarning(false), 5000);
      }
    }
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    
    if (!photographer) {
      alert('Por favor, preencha o nome do fotógrafo');
      return;
    }

    let finalImageUrl = imageUrl;

    if (uploadMode === 'file') {
      if (!imageFile) {
        alert('Por favor, selecione uma imagem');
        return;
      }
      finalImageUrl = imagePreview;
    } else {
      if (!imageUrl) {
        alert('Por favor, preencha a URL da imagem');
        return;
      }
    }

    const newImage = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      src: {
        medium: finalImageUrl,
        large: finalImageUrl,
        original: finalImageUrl,
      },
      photographer: photographer,
      alt: imageAlt || 'Imagem adicionada',
      width: 800,
      height: 600,
    };

    onAddImage(newImage);
    setImageUrl('');
    setImageFile(null);
    setImagePreview('');
    setPhotographer('');
    setImageAlt('');
    setUploadMode('file');
    setOpenAddModal(false);
    
    // Mostrar notificação de sucesso
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
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
                onClick={() => setOpenAddModal(true)}
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

      {/* Modal para Adicionar Imagem */}
      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
            overflow: 'hidden',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #e5eaf2',
            boxShadow: '0 4px 12px rgb(0 0 0 / 0.2)',
            width: '500px',
            maxWidth: '90vw',
            height: '600px',
            maxHeight: '90vh',
            padding: '2rem',
          }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-4">Adicionar Imagem</h2>

          {/* Abas de Upload */}
          <div className="flex gap-2 mb-6  border-gray-200">
           
            <button
              type="button"
              onClick={() => {
                setUploadMode('file');
                setImageUrl('');
              }}
              className={`px-4 py-2 font-medium transition-colors ${
                uploadMode === 'file'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upload de Arquivo
            </button>
          </div>

          <form onSubmit={handleAddImage} className="space-y-6">
           

            {/* Campo de Upload de Arquivo */}
            {uploadMode === 'file' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione uma Imagem
                </label>
                <br></br>
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                    imagePreview 
                      ? 'border-green-600 bg-green-100 shadow-lg' 
                      : 'border-gray-300 hover:border-green-500'
                  }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    {imagePreview ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="text-green-600" size={24} />
                        </div>
                        <p className="text-sm text-green-600 font-medium">Imagem anexada com sucesso</p>
                        <p className="text-xs text-gray-500">Clique para alterar</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto text-gray-400" size={32} />
                        <p className="text-sm text-gray-700 font-medium">Clique ou arraste uma imagem</p>
                        <p className="text-xs text-gray-500">Imagens até 500KB</p>

                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            <div>
              <br></br>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotógrafo
              </label>
              <input
                type="text"
                value={photographer}
                onChange={(e) => setPhotographer(e.target.value)}
                placeholder="Nome do fotógrafo"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <br></br>
              <br></br>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (Opcional)
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Descrição da imagem"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setOpenAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Popup Flutuante de Aviso */}
      {showSizeWarning && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
            zIndex: 9999,
            maxWidth: '350px',
            fontSize: '14px',
            fontWeight: '500',
            animation: 'slideInRight 0.3s ease-out',
            borderLeft: '4px solid #dc2626',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>⚠️</div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Arquivo muito grande!</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>{warningMessage}</div>
            </div>
          </div>
        </div>
      )}

      {/* Notificação de Sucesso */}
      {showSuccessNotification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#10b981',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            zIndex: 9999,
            maxWidth: '350px',
            fontSize: '14px',
            fontWeight: '500',
            animation: 'slideInRight 0.3s ease-out',
            borderLeft: '4px solid #059669',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>✅</div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Imagem adicionada com sucesso!</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>A imagem foi importada e está disponível na galeria.</div>
            </div>
          </div>
        </div>
      )}

      {/* Status */}
      {loading && <p className="text-center text-gray-600">Carregando imagens...</p>}
      {error && <p className="text-center text-red-600">Erro: {error}</p>}
    </div>
  );
};

export default SearchImg;

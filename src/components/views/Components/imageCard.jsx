import { useState, useEffect } from 'react';
import { X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from './Modal';

const ImageCard = ({image, onDelete, images}) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = () => {
    const index = images.findIndex(img => img.id === image.id);
    setCurrentIndex(index);
    setOpen(true);
  };
  
  const handleClose = () => setOpen(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const currentImage = images[currentIndex] || image;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open || !images || images.length <= 1) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, images, currentIndex]);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja deletar esta imagem?')) {
      onDelete?.(image.id);
    }
  };

  return (
    <>
      <div 
        className="image-card cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        onClick={handleOpen}
      >
        <img 
          src={image.src.medium} 
          alt={image.alt || image.photographer}
          className="w-full h-full object-cover"
        />
        <div className="image-card-overlay bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="text-white">
            <p className="font-semibold text-sm mb-1">{image.photographer}</p>
          </div>
        </div>
      </div>

      {/* Modal Avançado MUI */}
      <Modal
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <ModalContent>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors shadow-lg"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>

          {/* Delete button */}
          {image.id && typeof image.id === 'string' && image.id.startsWith('custom_') && (
            <button
              onClick={handleDelete}
              className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-red-200 rounded-full flex items-center justify-center hover:bg-red-300 transition-colors shadow-lg"
              title="Deletar imagem"
            >
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-700" />
            </button>
          )}

          {/* Image container */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white min-h-[300px] sm:min-h-[400px] md:min-h-[500px] relative">
            {/* Previous button - Left corner */}
            {images && images.length > 1 && (
              <button
                onClick={handlePrevious}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
                title="Imagem anterior"
              >
                <ChevronLeft style={{ width: '20px', height: '20px', color: 'white' }} />
              </button>
            )}

            {/* Next button - Right corner */}
            {images && images.length > 1 && (
              <button
                onClick={handleNext}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
                title="Próxima imagem"
              >
                <ChevronRight style={{ width: '20px', height: '20px', color: 'white' }} />
              </button>
            )}

            <img 
              src={currentImage.src.large || currentImage.src.original}
              alt={currentImage.alt || currentImage.photographer}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Info footer */}
          <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <p id="image-modal-title" className="font-semibold text-gray-900 text-sm sm:text-base truncate">{currentImage.photographer}</p>
                <p id="image-modal-description" className="text-xs sm:text-sm text-gray-600 truncate">{currentImage.alt || 'Imagem'}</p>
              </div>
              {images && images.length > 1 && (
                <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}

const ModalContent = ({ children, ...props }) => (
  <div
    {...props}
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
      width: '900px',
      maxWidth: '90vw',
      height: '700px',
      maxHeight: '90vh',
    }}
  >
    {children}
  </div>
);

export default ImageCard;
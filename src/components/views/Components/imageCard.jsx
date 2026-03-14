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
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 30,
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: '2px solid white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
            title="Fechar"
          >
            <X style={{ width: '24px', height: '24px', color: 'white' }} />
          </button>

          {/* Delete button - Only for custom uploaded images */}
          {currentImage.id && typeof currentImage.id === 'string' && currentImage.id.startsWith('custom_') && (
            <button
              onClick={() => onDelete(currentImage.id)}
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 30,
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                border: '2px solid white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
              }}
              title="Deletar imagem"
            >
              <Trash2 style={{ width: '22px', height: '22px', color: 'white' }} />
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
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px 32px',
            borderTop: 'none',
          }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  border: '3px solid white',
                  flexShrink: 0,
                }}>
                  {currentImage.photographer?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{
                    color: 'white',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    margin: '0 0 6px 0',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}>
                    {currentImage.photographer}
                  </p>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.95rem',
                    margin: 0,
                    fontWeight: '400',
                  }}>
                    {currentImage.alt || 'Imagem sem descrição'}
                  </p>
                </div>
              </div>
              {images && images.length > 1 && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 20px',
                  borderRadius: '50px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0,
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                  }}>
                    {currentIndex + 1}
                  </span>
                  <span style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1rem',
                  }}>
                    /
                  </span>
                  <span style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1rem',
                    fontWeight: '500',
                  }}>
                    {images.length}
                  </span>
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
      borderRadius: '20px',
      border: 'none',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      width: '95vw',
      maxWidth: '1100px',
      height: '90vh',
      maxHeight: '800px',
    }}
  >
    {children}
  </div>
);
export default ImageCard;
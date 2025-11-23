import React from 'react';
import SearchImg from './Components/SearchImg';
import ImageGrid from "../imageGrid";

const EstatisticasView = ({ 
  images, 
  loading, 
  error, 
  query, 
  setQuery, 
  onLoadMore, 
  loadingMore, 
  onAddImage, 
  onDeleteImage,
  SearchImg,
  ImageGrid
}) => {
  return (
    <div className="view-content">
      <div className="statistics-header">
      </div>
      
      <div className="statistics-content">
        <SearchImg 
          onSearch={setQuery}
          onAddImage={onAddImage}
        />
        
        <ImageGrid 
          images={images}
          loading={loading}
          onLoadMore={onLoadMore}
          onDeleteImage={onDeleteImage}
        />
        
        {error && (
          <div className="error-message">
            <p>Erro: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstatisticasView;

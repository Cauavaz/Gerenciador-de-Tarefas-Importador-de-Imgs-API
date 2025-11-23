import ImageCard from "./views/Components/imageCard";

const ImageGrid = ({images, loading, onLoadMore = () => {}, onDeleteImage = () => {}}) => {
    if(loading && (!images || images.length === 0)){
        return <p className="text-center text-gray-600 py-8">Carregando...</p>;
    }

    if((!images || images.length === 0) && !loading){
        return <p className="text-center text-gray-600 py-8">Nenhuma imagem encontrada</p>;
    }

    return (
        <div>
            <div className="image-grid">
                {images.map((image) => (
                    <ImageCard key={image.id} image={image} onDelete={onDeleteImage} images={images} />
                ))}
            </div>

            <div className="flex justify-center mt-8 mb-8">
                <button 
                    onClick={onLoadMore}
                    disabled={loading}
                    className="load-more-btn"
                >
                    {loading ? 'Carregando...' : 'Carregar Mais'}
                </button>
            </div>
        </div>
    )
}

export default ImageGrid;
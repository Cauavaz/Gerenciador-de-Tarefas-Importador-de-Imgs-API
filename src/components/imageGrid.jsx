import ImageCard from "./views/Components/imageCard";
import { Loader2 } from 'lucide-react';

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
                    className={`load-more-btn flex items-center gap-2 ${
                        loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                    }`}
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Carregando...' : 'Carregar Mais'}
                </button>
            </div>
        </div>
    )
}

export default ImageGrid;
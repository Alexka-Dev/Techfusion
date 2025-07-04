interface NewsCardProps {
  title: string;
  url: string;
  urlToImage: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, url, urlToImage }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative shadow-md hover:shadow-lg transition-shadow flex flex-col w-[90vw] mx-auto md:w-[60vw] md:h-[80vh] rounded-lg overflow-hidden"
    >
      {/* Imagen de fondo con título superpuesto */}
      <div className="h-full w-full">
        <img
          src={urlToImage}
          alt={title}
          className="w-full h-full object-cover rounded-t-lg"
        />

        {/* Gradiente para contraste del texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-t-lg" />

        {/* Título sobre la imagen, alineado a la izquierda y abajo */}
        <div className="absolute bottom-4 left-4 right-24 z-10">
          <h3 className="text-white md:text-5xl xs:text-xl font-bold leading-tight transition-all duration-300 text-glow-hover">
            {title}
          </h3>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;

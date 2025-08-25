"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button"; // Asegúrate de que esta ruta sea correcta

// Importamos la función unificada de NewsData.io
import { fetchNewsFromNewsDataAPI } from "./NewsApi";

// Interfaz para un artículo genérico en LatestNews
// Debe ser compatible con los campos que obtendrás de NewsData.io y los que usarás en el renderizado
interface Article {
  title: string;
  url: string;
  // Usamos 'string | null | undefined' ya que la imagen puede no estar siempre presente
  urlToImage: string | null | undefined;
  category: string; // "Crypto" o "Technology"
}

const LatestNews: React.FC = () => {
  const [cryptoArticles, setCryptoArticles] = useState<Article[]>([]);
  const [techArticles, setTechArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(16); // Cantidad de artículos visibles
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // --- Verificación de la API Key de NewsData.io ---
        // Ahora solo necesitamos la clave de NewsData.io
        const newsdataApiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
        if (!newsdataApiKey) {
          throw new Error(
            "Falta la clave API de NewsData.io. Revisa tu archivo .env.local y las variables de entorno de Vercel."
          );
        }

        // --- Llamadas a la API de NewsData.io para ambas categorías ---
        const [cryptoData, techData] = await Promise.all([
          // Para Crypto, usamos fetchNewsFromNewsDataAPI con la categoría "cryptocurrency"
          fetchNewsFromNewsDataAPI("cryptocurrency"),
          // Para Tecnología, usamos fetchNewsFromNewsDataAPI con la categoría "technology"
          fetchNewsFromNewsDataAPI("technology"),
        ]);

        // --- Procesamiento y Mapeo de Artículos de Crypto (NewsData.io) ---
        setCryptoArticles(
          (cryptoData || [])
            .filter((article) => article.title && article.link) // NewsData.io usa 'link'
            .map((a) => ({
              title: a.title,
              url: a.link, // Mapeado de 'link' a 'url'
              urlToImage: a.image_url || "https://via.placeholder.com/150", // Mapeado de 'image_url' a 'urlToImage'
              category: "Crypto",
            }))
        );

        // --- Procesamiento y Mapeo de Artículos de Tecnología (NewsData.io) ---
        setTechArticles(
          (techData || [])
            .filter((article) => article.title && article.link) // NewsData.io usa 'link'
            .map((a) => ({
              title: a.title,
              url: a.link, // Mapeado de 'link' a 'url'
              urlToImage: a.image_url || "https://via.placeholder.com/150", // Mapeado de 'image_url' a 'urlToImage'
              category: "Technology",
            }))
        );
      } catch (err: any) {
        console.error("Error al obtener las últimas noticias:", err);
        const errMsg =
          err.message ||
          "Error al obtener las noticias. Por favor, inténtalo de nuevo.";
        setError(errMsg);
      }
    };

    fetchNews();
  }, []); // Dependencias vacías para que se ejecute una sola vez al montar

  if (error) return <div className="text-red-500">{error}</div>;

  // --- Lógica para mezclar artículos (se mantiene igual, pero opera sobre los nuevos datos) ---
  const mixArticles = (): Article[] => {
    const mixed: Article[] = [];
    // Calcula el número máximo de "bloques" que podemos formar con los artículos disponibles
    const maxArticlesPerCategory = Math.max(
      cryptoArticles.length,
      techArticles.length
    );
    const totalBlocks = Math.ceil(maxArticlesPerCategory / 4); // Asumiendo 4 artículos por categoría por bloque

    for (let i = 0; i < totalBlocks; i++) {
      // Añade 4 artículos de Crypto si están disponibles
      const cryptoSlice = cryptoArticles.slice(i * 4, i * 4 + 4);
      if (cryptoSlice.length > 0) {
        mixed.push(...cryptoSlice);
      }
      // Añade 4 artículos de Tecnología si están disponibles
      const techSlice = techArticles.slice(i * 4, i * 4 + 4);
      if (techSlice.length > 0) {
        mixed.push(...techSlice);
      }
    }
    // Retorna solo la cantidad visible deseada
    return mixed.slice(0, visibleCount);
  };

  const visibleArticles = mixArticles();

  return (
    <section
      id="latest"
      className="flex flex-col py-16 px-6 md:px-16 bg-gray-200 space-y-4 w-screen"
    >
      <h2
        style={{ color: "var(--text-purple)" }}
        className="text-5xl font-extrabold pt-20 xs:pt-2 pb-10"
      >
        Últimas Noticias
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {visibleArticles.map((article, index) => (
          <div
            key={index}
            className="bg-[rgba(247,246,246,0.7)] border-2 border-gray-50 rounded-md cursor-pointer hover:shadow-lg"
            style={{ height: "250px" }} // Tamaño consistente
            onClick={() => router.push(article.url)}
          >
            {/* Imagen (70%) */}
            <div className="h-4/6 w-full">
              {/* Usamos el fallback de placeholder si urlToImage es null o undefined */}
              <img
                src={article.urlToImage || "https://via.placeholder.com/150"}
                alt={article.title}
                className="w-full h-full object-cover rounded-md transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>

            {/* Información (30%) */}
            <div className="h-2/5 w-full p-2 flex flex-col justify-start ">
              <span className="text-xs text-gray-400 hover:text-gray-600 uppercase font-semibold">
                {article.category}
              </span>
              <h3 className="text-xs font-semibold text-gray-800 pt-1 hover:text-gray-600 ">
                {article.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
      {/* El botón "Ver Más" se mostrará si hay más artículos disponibles */}
      {cryptoArticles.length + techArticles.length > visibleArticles.length && (
        <div className="text-left py-16 ">
          <Button onClick={() => setVisibleCount((prev) => prev + 8)}>
            Ver Más...
          </Button>
        </div>
      )}
    </section>
  );
};

export default LatestNews;

"use client";
import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard"; // Asegúrate de que esta ruta sea correcta
// Importamos la nueva función unificada desde NewsApi.ts
import { fetchNewsFromNewsDataAPI } from "./NewsApi";

interface Article {
  title: string;
  url: string;
  // Cambiamos 'image' a 'urlToImage' y permitimos 'string | null' o 'undefined'
  urlToImage: string | undefined;
  publishedDate?: string; // Propiedad opcional
  text?: string; // Propiedad opcional
}

const CryptoNewsGrid: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoNews = async () => {
    setLoading(true); // Reinicia loading a true en cada llamada
    setError(null); // Limpia errores previos
    try {
      // La verificación de la API Key ahora está dentro de fetchNewsFromNewsDataAPI,
      // pero aún es buena práctica verificarla aquí también si quieres un error más inmediato.
      const newsdataApiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
      if (!newsdataApiKey) {
        throw new Error(
          "Falta la clave API de NewsData.io. Revisa tu archivo .env.local y las variables de entorno."
        );
      }

      // Llamamos a la función de la API de NewsData.io para cripto
      // NewsDataArticle tiene 'link' e 'image_url'
      const fetchedNewsDataArticles = await fetchNewsFromNewsDataAPI(
        "cryptocurrency"
      );

      let mainArticleWithImage: Article | undefined;
      const otherArticles: Article[] = [];

      for (const article of fetchedNewsDataArticles) {
        // NewsData.io usa 'link' y 'image_url'
        if (article.title && article.link) {
          // Siempre verifica título y URL
          if (article.image_url && !mainArticleWithImage) {
            // Buscamos la primera con imagen
            mainArticleWithImage = {
              title: article.title,
              url: article.link,
              urlToImage: article.image_url,
              // Puedes añadir publishedDate y text si NewsDataArticle los tiene y los necesitas
              publishedDate: article.pubDate, // NewsData.io usa pubDate
              text: article.description, // NewsData.io usa description
            };
          } else {
            otherArticles.push({
              title: article.title || "Sin Título",
              url: article.link,
              // Usa image_url o el placeholder si no hay imagen
              urlToImage:
                article.image_url || "https://via.placeholder.com/150",
            });
          }
        }
      }

      // Asegurar que siempre haya una noticia principal
      // Si no encontramos una con imagen, usamos la primera disponible con placeholder
      if (!mainArticleWithImage && fetchedNewsDataArticles.length > 0) {
        mainArticleWithImage = {
          title: fetchedNewsDataArticles[0].title || "Sin Título",
          url: fetchedNewsDataArticles[0].link,
          urlToImage:
            fetchedNewsDataArticles[0].image_url ||
            "https://via.placeholder.com/150",
          publishedDate: fetchedNewsDataArticles[0].pubDate,
          text: fetchedNewsDataArticles[0].description,
        };
        // Agrega el resto de los artículos después de la "primera" que ahora es mainArticleWithImage
        otherArticles.unshift(
          ...fetchedNewsDataArticles.slice(1).map((article) => ({
            title: article.title || "Sin Título",
            url: article.link,
            urlToImage: article.image_url || "https://via.placeholder.com/150",
          }))
        );
      } else if (!mainArticleWithImage) {
        // Si no hay ningún artículo válido
        setArticles([]);
        setLoading(false);
        setError("No se encontraron noticias de cripto válidas para mostrar.");
        return;
      }

      // Aseguramos que mainArticleWithImage siempre sea el primer elemento
      const finalArticles = mainArticleWithImage
        ? [mainArticleWithImage, ...otherArticles]
        : otherArticles;
      setArticles(finalArticles);
      setLoading(false);
    } catch (err: any) {
      console.error("Error al obtener noticias de cripto:", err.message || err);
      setError(
        "Error al obtener noticias de cripto. Por favor, inténtalo de nuevo."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoNews();
    // Considera el uso de la caché y evita intervalos muy frecuentes en producción para el plan gratuito.
    // const interval = setInterval(fetchCryptoNews, 24 * 60 * 60 * 1000);
    // return () => clearInterval(interval);
  }, []); // Dependencias vacías para que se ejecute solo una vez al montar

  if (loading) return <div>Cargando noticias de cripto...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Asegura que articles[0] exista antes de acceder a él
  const latestArticle = articles.length > 0 ? articles[0] : undefined;
  const otherArticlesList = articles.slice(1); // El resto de las noticias

  return (
    <section id="crypto" className="flex flex-col md:p-16 xs:px-2 xs:pt-12">
      <h3 className="font-title font-semibold text-3xl xs:text-2xl pt-14 md:text-4xl pb-4 md:pb-8 md:px-0 xs:px-4">
        Noticias de Criptomonedas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-10 gap-20">
        <div className="w-full md:col-span-7 sm:w-[90%]">
          {latestArticle && (
            <NewsCard
              title={latestArticle.title}
              url={latestArticle.url}
              urlToImage={latestArticle.urlToImage} // Usamos urlToImage aquí
            />
          )}
        </div>

        {/* Columna derecha: Partners y lista de títulos */}
        <div className="hidden md:flex col-span-3 flex-col h-[80vh]">
          {/* Partners */}
          <div className="bg-transparent border border-blue-300 shadow-sm p-2 mb-10 rounded-lg flex flex-col items-center flex-shrink-0 basis-2/5">
            <h2 className="text-white text-xl text-center font-tech pb-12 ">
              Nuestros Socios
            </h2>
            <a
              href="https://bytepeaktechnology.com/"
              className="flex justify-center w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/bytepeak-logo.png"
                alt="bytepeak-logo"
                className="rounded-lg w-[70%] max-w-full h-auto"
              />
            </a>
          </div>

          {/* Lista deslizable de títulos */}
          <div className="overflow-y-auto no-scrollbar flex-grow basis-3/5">
            <h2 className="font-title text-lg font-bold mb-2">
              Más Noticias de Cripto
            </h2>
            <ul className="space-y-2">
              {otherArticlesList.map((article, index) => (
                <li key={index}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-tech text-xs text-gray-100 hover:text-purple-300 block"
                  >
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CryptoNewsGrid;

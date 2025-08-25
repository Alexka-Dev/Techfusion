"use client";
import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard"; // Asegúrate de que esta ruta sea correcta
// Importamos la función unificada desde NewsApi.ts
import { fetchNewsFromNewsDataAPI } from "./NewsApi";

// Definición de la interfaz para un artículo. Ahora coincide con NewsData.io
interface Article {
  title: string;
  url: string;
  // Cambiado a 'string | null | undefined' para mayor precisión con NewsData.io
  urlToImage: string | undefined;
}

const TechNewsGrid: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechNews = async () => {
    setLoading(true); // Reinicia loading a true en cada llamada
    setError(null); // Limpia errores previos
    try {
      // Verificación de la API Key de NewsData.io (que es la que usaremos ahora)
      const newsdataApiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
      if (!newsdataApiKey) {
        throw new Error(
          "Falta la clave API de NewsData.io. Revisa tu archivo .env.local y las variables de entorno."
        );
      }

      // Llamamos a la función de la API de NewsData.io para noticias de tecnología
      // NewsData.io retorna artículos con propiedades 'link' e 'image_url'
      const fetchedNewsDataArticles = await fetchNewsFromNewsDataAPI(
        "technology"
      );

      // --- LÓGICA DE FILTRADO PARA LA NOTICIA PRINCIPAL CON IMAGEN ---
      let mainArticleWithImage: Article | undefined;
      const otherArticles: Article[] = []; // Este array contendrá el resto de noticias

      // Iteramos sobre todos los artículos obtenidos para encontrar la principal y el resto
      for (const article of fetchedNewsDataArticles) {
        // Asegúrate de que el artículo tenga título y URL (obligatorios)
        // NewsData.io usa 'link' para la URL y 'image_url' para la imagen
        if (article.title && article.link) {
          if (article.image_url && !mainArticleWithImage) {
            // Si aún no hemos encontrado la noticia principal con imagen, esta es
            mainArticleWithImage = {
              title: article.title,
              url: article.link,
              urlToImage: article.image_url, // Usamos image_url de NewsData.io
            };
          } else {
            // Si ya encontramos la principal, este artículo va al resto
            otherArticles.push({
              title: article.title || "Sin Título",
              url: article.link,
              // Usamos el placeholder si la imagen_url de este artículo secundario no existe
              urlToImage:
                article.image_url || "https://via.placeholder.com/150",
            });
          }
        } else {
          // Si el artículo actual no tiene título o URL, va directo a 'otherArticles' con placeholder
          otherArticles.push({
            title: article.title || "Sin Título", // Aseguramos un título
            url: article.link || "#", // Aseguramos una URL válida
            urlToImage: "https://via.placeholder.com/150", // Siempre usa placeholder si no hay imagen real
          });
        }
      }

      // --- Post-procesamiento: Asegurar que siempre haya una noticia principal ---
      if (!mainArticleWithImage && fetchedNewsDataArticles.length > 0) {
        // Si no se encontró ninguna noticia con imagen después de iterar,
        // toma la primera noticia obtenida (aunque no tenga imagen) y asígnale un placeholder.
        mainArticleWithImage = {
          title: fetchedNewsDataArticles[0].title || "Sin Título",
          url: fetchedNewsDataArticles[0].link,
          urlToImage:
            fetchedNewsDataArticles[0].image_url ||
            "https://via.placeholder.com/150",
        };
        // Para evitar duplicar el primer artículo si no tenía imagen y fue a otherArticles,
        // reestructuramos otherArticles para que no lo contenga si ya es mainArticleWithImage
        // Esto solo es necesario si el primer artículo se agregó a otherArticles *antes* de convertirse en mainArticle.
        // La lógica actual en el bucle ya evita que se añada a `otherArticles` si se convierte en `mainArticleWithImage`.
        // Sin embargo, si `mainArticleWithImage` se establece aquí desde `fetchedArticles[0]`,
        // necesitamos asegurarnos de que `otherArticles` no contenga ese mismo artículo.
        // La forma más sencilla es reconstruir `otherArticles` a partir de los `fetchedNewsDataArticles`
        // excluyendo el que se convirtió en `mainArticleWithImage`.
        const articlesForOtherList = fetchedNewsDataArticles
          .filter((article, index) => {
            // Si el article original es el mismo que nuestro mainArticleWithImage (por URL por ejemplo)
            // Y si mainArticleWithImage fue definido por fetchedArticles[0], entonces omitimos fetchedArticles[0]
            if (
              mainArticleWithImage &&
              article.link === mainArticleWithImage.url &&
              index === 0
            ) {
              return false;
            }
            return true;
          })
          .map((article) => ({
            title: article.title || "Sin Título",
            url: article.link,
            urlToImage: article.image_url || "https://via.placeholder.com/150",
          }));

        // Ahora combinamos: mainArticleWithImage + el resto de artículos (asegurando que el primero no se duplique)
        setArticles([mainArticleWithImage, ...articlesForOtherList]);
      } else if (!mainArticleWithImage) {
        // Si no hay *ningún* artículo válido en absoluto (fetchedNewsDataArticles.length es 0)
        setArticles([]);
        setLoading(false);
        setError(
          "No se encontraron noticias válidas de tecnología para mostrar."
        );
        return;
      }

      // Si mainArticleWithImage ya se encontró en el bucle y ya se agregó a 'articles',
      // y otherArticles ya está correctamente poblado, solo combinamos.
      if (mainArticleWithImage) {
        setArticles([mainArticleWithImage, ...otherArticles]);
      }

      setLoading(false);
    } catch (err: any) {
      console.error(
        "Error al obtener noticias de tecnología:",
        err.message || err
      );
      setError(
        "Error al obtener noticias de tecnología. Por favor, inténtalo de nuevo."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechNews();
    // La línea del intervalo está comentada, lo cual es bueno para evitar límites en desarrollo.
    // const interval = setInterval(fetchTechNews, 24 * 60 * 60 * 1000);
    // return () => clearInterval(interval);
  }, []); // Dependencias vacías para que se ejecute solo una vez al montar

  if (loading) return <div>Cargando noticias de tecnología...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Asegura que `articles` tenga al menos un elemento antes de acceder a `articles[0]`
  const latestArticle = articles.length > 0 ? articles[0] : undefined;
  const otherArticlesList = articles.slice(1); // El resto de las noticias

  return (
    <section
      id="technology"
      className="flex flex-col md:px-16 xs:px-2 pt-14 pb-28"
    >
      <h3 className="font-title font-semibold text-3xl pt-14 md:text-4xl xs:text-2xl md:px-0 pb-4 md:pb-8 xs:px-4">
        Noticias de Tecnología
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-10 gap-20">
        <div className="w-full md:col-span-7 sm:w-[90%]">
          {latestArticle && ( // Aseguramos que haya un latestArticle antes de renderizar
            <NewsCard
              title={latestArticle.title}
              url={latestArticle.url}
              urlToImage={latestArticle.urlToImage} // Pasamos la URL de la imagen (real o placeholder)
            />
          )}
        </div>

        {/* Columna derecha: Partners y lista de títulos */}
        <div className="hidden md:flex col-span-3 flex-col h-[80vh]">
          {/* Partners */}
          <div className="bg-transparent border border-blue-300 shadow-sm p-2 mb-10 rounded-lg flex flex-col items-center flex-shrink-0 basis-2/5">
            <h2 className="text-white text-xl text-center font-tech pb-12">
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
            <h2 className="text-lg font-bold mb-2">Más Noticias</h2>
            <ul className="space-y-2">
              {otherArticlesList.map((article, index) => (
                <li key={index}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-100 hover:text-purple-300 block"
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

export default TechNewsGrid;

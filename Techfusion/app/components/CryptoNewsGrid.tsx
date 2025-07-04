"use client";
import React, { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import axios from "axios";

interface NewsArticle {
  title: string;
  url: string;
  urlToImage: string;
}

const CryptoNewsGrid: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoNews = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY; // Clave API desde .env
        if (!apiKey) {
          throw new Error("Missing News API Key. Check your .env file.");
        }

        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: "crypto AND (bitcoin OR ethereum)", // Tema: criptomonedas
            sortBy: "publishedAt",
            language: "en",
            apiKey: apiKey,
          },
        });

        // Verifica si hubo un error en la respuesta
        if (response.data.status !== "ok") {
          console.warn("🚨 Error en la respuesta de News API:", response.data);
          setError(
            "Hubo un problema al obtener las noticias. Intenta más tarde."
          );
          setLoading(false);
          return;
        }

        // Procesa los artículos
        const fetchedArticles = response.data.articles || [];
        const formattedArticles = fetchedArticles.map(
          (article: NewsArticle) => ({
            title: article.title || "No Title",
            url: article.url,
            urlToImage: article.urlToImage || "https://via.placeholder.com/150",
          })
        );

        setArticles(formattedArticles);
        setLoading(false);
      } catch (err: unknown) {
        console.error("Error fetching crypto news:", err);
        setError("Error fetching crypto news. Please try again.");
        setLoading(false);
      }
    };

    fetchCryptoNews();

    // Configura la actualización diaria
    const interval = setInterval(fetchCryptoNews, 24 * 60 * 60 * 1000); // Cada 24 horas
    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  if (loading) return <div>Loading crypto news...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Dividimos la última noticia y el resto
  const latestArticle = articles[0]; // Última noticia
  const otherArticles = articles.slice(1); // Resto de noticias

  return (
    <section id="crypto" className="flex flex-col md:p-16 xs:px-2 xs:pt-12">
      <h3 className="font-title font-semibold text-3xl xs:text-2xl md:text-4xl pb-4  md:pb-8 md:px-0  xs:px-4">
        Crypto News
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-10 gap-20">
        <div className="w-full md:col-span-7 sm:w-[90%]">
          {latestArticle && (
            <NewsCard
              title={latestArticle.title}
              url={latestArticle.url}
              urlToImage={latestArticle.urlToImage}
            />
          )}
        </div>

        {/* Columna derecha: Partners (al inicio) y lista de títulos (debajo de partners) */}
        <div className="hidden md:flex col-span-3 flex-col h-[80vh]">
          {/* Partners - 40% del alto */}
          <div className="bg-transparent border border-blue-300 shadow-sm p-2 mb-10 rounded-lg flex flex-col items-center flex-shrink-0 basis-2/5">
            <h2 className="text-white text-xl text-center font-tech pb-12 ">
              Our Partners
            </h2>
            <a
              href="https://bytepeaktechnology.com/"
              className="flex justify-center w-full"
            >
              <img
                src="/bytepeak-logo.png"
                alt="bytepeak-logo"
                className="rounded-lg w-[70%] max-w-full h-auto"
              />
            </a>
          </div>

          {/* Lista deslizable de títulos - 60% del alto */}
          <div className="overflow-y-auto no-scrollbar flex-grow basis-3/5">
            <h2 className="font-title text-lg font-bold mb-2">More News</h2>
            <ul className="space-y-2">
              {otherArticles.map((article, index) => (
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
      {/* Columna izquierda: Última noticia (70% de la pantalla) */}
    </section>
  );
};

export default CryptoNewsGrid;

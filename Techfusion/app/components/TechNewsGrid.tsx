"use client";
import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import axios from "axios";

interface Article {
  title: string;
  url: string;
  urlToImage: string;
}

const TechNewsGrid: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechNews = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY; // Cargamos API Key desde el entorno
      if (!apiKey) {
        throw new Error("Missing NewsAPI Key. Check your .env file.");
      }

      const response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          category: "technology",
          sortBy: "publishedAt",
          language: "en",
          apiKey: apiKey,
        },
      });

      const fetchedArticles = response.data.articles || [];
      const formattedArticles = fetchedArticles.map((article: Article) => ({
        title: article.title || "No Title",
        url: article.url,
        urlToImage: article.urlToImage || "https://via.placeholder.com/150",
      }));

      setArticles(formattedArticles);
      setLoading(false);
    } catch {
      setError("Error fetching tech news. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechNews();

    // Configura actualización periódica (cada 24 horas)
    const interval = setInterval(fetchTechNews, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading crypto news...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const latestArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <section
      id="technology"
      className="flex flex-col md:px-16 xs:px-2 pt-14 pb-28"
    >
      <h3 className="font-title font-semibold text-3xl pt-14 md:text-4xl xs:text-2xl md:px-0 pb-4 md:pb-8 xs:px-4">
        Tech News
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
            <h2 className="text-white text-xl text-center font-tech pb-12">
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
            <h2 className="text-lg font-bold mb-2">More News</h2>
            <ul className="space-y-2">
              {otherArticles.map((article, index) => (
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
      {/* Columna izquierda: Última noticia (70% de la pantalla) */}
    </section>
  );
};

export default TechNewsGrid;

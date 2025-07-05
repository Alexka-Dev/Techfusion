"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Button from "./Button";

interface Article {
  title: string;
  url: string;
  urlToImage: string;
  category: string;
}

const LatestNews: React.FC = () => {
  const [cryptoArticles, setCryptoArticles] = useState<Article[]>([]);
  const [techArticles, setTechArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(16); // Controlar cantidad visible
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const [cryptoRes, techRes] = await Promise.all([
          axios.get("https://newsapi.org/v2/everything", {
            params: {
              q: "crypto OR blockchain",
              sortBy: "publishedAt",
              language: "en",
              apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
            },
          }),
          axios.get("https://newsapi.org/v2/top-headlines", {
            params: {
              category: "technology",
              sortBy: "publishedAt",
              language: "en",
              apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
            },
          }),
        ]);

        setCryptoArticles(
          (cryptoRes.data.articles || []).map((a: Article) => ({
            ...a,
            category: "Crypto",
          }))
        );
        setTechArticles(
          (techRes.data.articles || []).map((a: Article) => ({
            ...a,
            category: "Technology",
          }))
        );
        setLoading(false);
      } catch (error) {
        setError("Error fetching news.");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  const mixArticles = (): Article[] => {
    const mixed: Article[] = [];
    const blockCount = Math.floor(visibleCount / 8);
    for (let i = 0; i < blockCount; i++) {
      mixed.push(...cryptoArticles.slice(i * 4, i * 4 + 4));
      mixed.push(...techArticles.slice(i * 4, i * 4 + 4));
    }
    return mixed;
  };

  const visibleArticles = mixArticles();

  return (
    <section
      id="latest"
      className="flex flex-col py-16 px-6 md:px-16 bg-gray-200 space-y-4 w-screen"
      /*"w-screen -ml-[5vw] sm:-ml-[5rem]   bg-gray-200 px-6 md:px-16 pt-12 space-y-4"*/
    >
      <h2
        style={{ color: "var(--text-purple)" }}
        className="text-5xl font-extrabold pt-20 xs:pt-2 pb-10"
      >
        Latest News
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
              <img
                src={article.urlToImage}
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
      {cryptoArticles.length + techArticles.length > visibleArticles.length && (
        <div className="text-left py-16 ">
          <Button>See More...</Button>
        </div>
      )}
    </section>
  );
};

export default LatestNews;

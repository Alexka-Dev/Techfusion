import axios, { AxiosResponse } from "axios";

const apiKey: string = process.env.NEXT_PUBLIC_NEWS_API_KEY ?? "";

interface Article {
  title: string;
  description: string;
  url: string;
}

interface NewsAPIResponse {
  articles: Article[];
}

export const fetchNewsFromNewsAPI = async (
  query: string
): Promise<Article[]> => {
  const url: string = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&apiKey=${apiKey}`;

  try {
    const response: AxiosResponse<NewsAPIResponse> =
      await axios.get<NewsAPIResponse>(url);

    if (response.data.articles && Array.isArray(response.data.articles)) {
      return response.data.articles;
    } else {
      console.error("No articles found in the response");
      return [];
    }
  } catch (error) {
    console.error("Error fetching News From NewsAPI:", error);
    return [];
  }
};

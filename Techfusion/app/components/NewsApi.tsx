import axios, { AxiosResponse } from "axios";

// --- Clave API de NewsData.io ---
// Asegúrate de tener NEXT_PUBLIC_NEWSDATA_API_KEY en tu archivo .env.local
const newsdataApiKey: string = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY ?? "";

// --- Configuración de la caché ---
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos de duración de la caché (en milisegundos)

interface CachedData<T> {
  timestamp: number;
  data: T;
}

// Funciones auxiliares para manejar la caché en localStorage
function getFromCache<T>(key: string): T | null {
  // Solo ejecuta en el entorno del navegador (no en el servidor Next.js)
  if (typeof window === "undefined") return null;
  try {
    const cachedItem = localStorage.getItem(key);
    if (cachedItem) {
      const parsed: CachedData<T> = JSON.parse(cachedItem);
      // Si la caché no ha expirado
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        console.log(`Cache HIT for ${key}`);
        return parsed.data;
      } else {
        console.log(`Cache EXPIRED for ${key}`);
        localStorage.removeItem(key); // Limpia los datos expirados
      }
    }
  } catch (e) {
    console.error(`Error reading cache for ${key}:`, e);
  }
  return null;
}

function saveToCache<T>(key: string, data: T): void {
  // Solo ejecuta en el entorno del navegador
  if (typeof window === "undefined") return;
  try {
    const item: CachedData<T> = {
      timestamp: Date.now(),
      data: data,
    };
    localStorage.setItem(key, JSON.stringify(item));
    console.log(`Cache STORED for ${key}`);
  } catch (e) {
    console.error(`Error writing cache for ${key}:`, e);
  }
}

// --- Interfaz para un artículo de NewsData.io ---
// (Esta interfaz define la estructura esperada de los artículos de NewsData.io)
interface NewsDataArticle {
  article_id: string;
  title: string;
  link: string; // NewsData.io usa 'link' para la URL del artículo
  image_url: string | null; // NewsData.io usa 'image_url' para la URL de la imagen (puede ser null)
  description: string;
  pubDate: string;
  source_id: string;
  source_name: string;
  // Puedes añadir otros campos de NewsData.io si los necesitas:
  // keywords?: string[];
  // creator?: string | null;
  // content?: string;
  // category?: string[];
  // country?: string[];
}

// Interfaz para la respuesta completa de la API de NewsData.io
interface NewsDataAPIResponse {
  status: string;
  totalResults: number;
  results: NewsDataArticle[]; // Los artículos reales están en la propiedad 'results'
}

// --- Función unificada para obtener noticias de NewsData.io ---
// Puede obtener noticias de diferentes categorías según el 'categoryType'
export const fetchNewsFromNewsDataAPI = async (
  categoryType: "technology" | "cryptocurrency" | string // Permite otras strings para flexibilidad, pero tipa las comunes
): Promise<NewsDataArticle[]> => {
  const cacheKey = `newsdata_news_${categoryType}`;
  const cachedResult = getFromCache<NewsDataArticle[]>(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  // Verificar la clave API antes de hacer la llamada
  if (!newsdataApiKey) {
    console.error(
      "NewsData API Key no configurada. Revisa tu archivo .env.local."
    );
    throw new Error("NewsData API Key no configurada.");
  }

  const baseUrl: string = "https://newsdata.io/api/1/latest";
  const params: any = {
    // Usamos 'any' porque los parámetros pueden variar un poco
    apikey: newsdataApiKey,
    language: "en", // Idioma de las noticias
    size: "10", // Número de artículos a obtener
  };

  // Ajusta los parámetros según la categoría solicitada
  if (categoryType === "cryptocurrency") {
    //params.q = "crypto OR blockchain"; // Palabras clave para cripto
    params.category = "cryptocurrency"; // Categoría de NewsData.io para cripto
  } else if (categoryType === "technology") {
    params.category = "technology"; // Categoría de NewsData.io para tecnología
    // Si quieres ser más específico, podrías añadir keywords aquí también:
    // params.q = "tech OR innovation";
  } else {
    // Si se pasa una categoría no manejada explícitamente, se puede buscar por palabra clave general
    params.q = categoryType;
  }

  try {
    const response: AxiosResponse<NewsDataAPIResponse> =
      await axios.get<NewsDataAPIResponse>(baseUrl, { params });

    // NewsData.io devuelve los artículos en la propiedad 'results'
    if (response.data.results && Array.isArray(response.data.results)) {
      // Filtra artículos que no tienen título o enlace (que son esenciales para tu NewsCard)
      const articles = response.data.results.filter(
        (article) => article.title && article.link
      );
      saveToCache(cacheKey, articles); // Guarda los artículos válidos en caché
      return articles;
    } else {
      console.error(
        `No se encontraron artículos para '${categoryType}' en la respuesta de NewsData.io o el formato es inválido.`,
        response.data
      );
      return [];
    }
  } catch (error) {
    console.error(
      `Error al obtener noticias de '${categoryType}' de NewsData.io API:`,
      error
    );
    // Propaga el error para que los componentes que llaman puedan manejarlo
    throw error;
  }
};

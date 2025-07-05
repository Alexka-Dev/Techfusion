"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

const CryptoSlider: React.FC = () => {
  const [data, setData] = useState<Crypto[]>([]);
  const scrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        setData([...response.data, ...response.data]); // Duplicamos los datos para un scroll infinito
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!scrollRef.current || data.length === 0) return;

    const scrollElement = scrollRef.current;
    const scrollSpeed = 1; // Ajusta la velocidad del scroll

    const scroll = () => {
      scrollElement.scrollLeft += scrollSpeed;

      // Si el scroll llega al final, vuelve al inicio sin interrupción
      if (scrollElement.scrollLeft >= scrollElement.scrollWidth / 2) {
        scrollElement.scrollLeft = 0;
      }

      requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);
  }, [data]);

  return (
    <nav
      id="slider"
      className="flex items-center justify-between w-full h-9 bg-[rgba(39,19,53,0.78)] overflow-hidden"
    >
      <ul
        ref={scrollRef}
        className="flex space-x-10 overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar p-1 h-10"
      >
        {data.map((crypto: Crypto, index) => (
          <li
            key={`${crypto.id}-${index}`}
            className="flex items-center justify-center space-x-1 bg-[#ddd9d9c7] rounded-3xl"
            style={{ lineHeight: ".8rem" }}
          >
            <img
              src={crypto.image}
              alt={crypto.name}
              className="max-h-5 w-6 object-contain ml-1"
            />
            <div
              className="flex flex-col w-28 items-center text-center font-semibold text-gray-800"
              style={{ fontSize: ".65rem" }}
            >
              <span className="leading-none">
                {crypto.name} ({crypto.symbol})
              </span>
              <span className="text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap">
                ${crypto.current_price.toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CryptoSlider;

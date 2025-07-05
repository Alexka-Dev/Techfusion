"use client";
import React, { useState } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú desplegable

  return (
    <nav className="bg-[#231240] fixed w-full h-20 z-20 top-0 sm:py-1">
      <div className="w-full py-2 flex items-center sm:px-2">
        <div className="flex items-center justify-center w-full space-x-2 py-2">
          <img src="/TF-logo1.png" className="h-12" alt="Logo" />
          <img src="/techfusion.png" className="h-12" alt="Techfusion" />
        </div>

        {/* Botón hamburguesa solo en pantallas pequeñas */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-hamburger"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5h14a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm0 6h14a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1a1 1 0 011-1zm0 6h14a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Contenedor desplegable solo en pantallas pequeñas */}
      {isOpen && (
        <div
          className="fixed inset-x-0 top-0 h-1/2 bg-background text-white flex flex-col items-center justify-center z-20 md:hidden" // Ocupa 50% del alto de la pantalla
        >
          {/* Botón para cerrar el menú */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Enlaces de navegación */}
          <ul className="space-y-8 text-lg font-bold">
            <li>
              <a
                href="#hero"
                className="hover:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

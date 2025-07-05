import { ReactNode } from "react";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children }) => {
  return (
    <div>
      <button
        type="button"
        className={`font-title text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-3xl text-sm px-5 py-2.5 text-center me-2 mb-2`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;

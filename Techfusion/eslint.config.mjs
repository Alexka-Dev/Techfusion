import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_", // Ignora argumentos que empiezan con _
          varsIgnorePattern: "^_", // Ignora variables que empiezan con _
          caughtErrors: "none", // No te quejes si la variable 'error' en un catch no se usa directamente
        },
      ],
    },
  },
  // --- FIN DE MODIFICACIONES ---
];

export default eslintConfig;

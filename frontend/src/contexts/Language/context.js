import { createContext } from "react";

// Define flag URLs for each language
const FLAGS = {
  en: "https://flagcdn.com/w40/gb.png",
  sv: "https://flagcdn.com/w40/se.png",
};

// Create context with default values including getFlag function
export const LanguageContext = createContext({
  language: "sv",
  setLanguage: () => {},
  t: (key) => key,
  toggleLanguage: () => {},
  getLanguageName: () => "Svenska",
  getFlag: () => FLAGS.sv,
});

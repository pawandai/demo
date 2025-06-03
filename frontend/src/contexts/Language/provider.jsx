import { useState, useEffect } from "react";
import { LanguageContext } from "./context";

// Import translations (we'll create these next)
import translations from "../../translations";

// Define flag URLs for each language
const FLAGS = {
  en: "https://flagcdn.com/w40/gb.png",
  sv: "https://flagcdn.com/w40/se.png"
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage || "sv"; // Default to Swedish
  });

  // Update when language changes
  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language] || translations.sv;
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    return value;
  };

  const toggleLanguage = () => {
    setLanguage(language === "sv" ? "en" : "sv");
  };

  const getLanguageName = () => {
    return language === "sv" ? "Svenska" : "English";
  };

  // Fixed getFlag function
  const getFlag = () => {
    return FLAGS[language] || FLAGS.sv;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        toggleLanguage,
        getLanguageName,
        getFlag
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

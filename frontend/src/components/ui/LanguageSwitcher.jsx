import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react'; // Import Globe icon

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-300 ease-in-out"
    >
      <Globe className="h-5 w-5" />
      <span>{i18n.language.toUpperCase()}</span>
    </button>
  );
};

export default LanguageSwitcher;

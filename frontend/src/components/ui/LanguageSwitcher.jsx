import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>
        English
      </Button>
      <Button onClick={() => changeLanguage('bn')} disabled={i18n.language === 'bn'}>
        বাংলা
      </Button>
    </div>
  );
};

export default LanguageSwitcher;

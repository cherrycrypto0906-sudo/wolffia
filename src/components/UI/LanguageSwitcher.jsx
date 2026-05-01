import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('vi') ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="language-switcher" onClick={toggleLanguage} role="button" tabIndex={0} aria-label="Toggle language">
      <span className={`lang-icon ${i18n.language.startsWith('vi') ? 'active' : ''}`}>VN</span>
      <span className="lang-divider">/</span>
      <span className={`lang-icon ${i18n.language.startsWith('en') ? 'active' : ''}`}>EN</span>
    </div>
  );
};

// Simple JS localization system for Expo Go compatibility
const translations = {
  en: {
    settings: 'Settings',
    terms: 'Terms and Conditions',
    privacy: 'Privacy Policy',
    support: 'Support',
    upgrade: 'Upgrade to Pro',
    changeLanguage: 'Change App Language',
    trademark: '© whiskey-code 2026',
  },
  es: {
    settings: 'Configuración',
    terms: 'Términos y condiciones',
    privacy: 'Política de privacidad',
    support: 'Soporte',
    upgrade: 'Actualizar a Pro',
    changeLanguage: 'Cambiar idioma de la aplicación',
    trademark: '© whiskey-code 2026',
  },
};

let currentLocale = 'en';

export function setLocale(locale) {
  currentLocale = locale;
}

export function t(key) {
  return translations[currentLocale]?.[key] || translations['en'][key] || key;
}

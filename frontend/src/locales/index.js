import { createI18n } from 'vue-i18n';
import vi from './vi.json';
import en from './en.json';

const messages = {
  vi,
  en
};

// Lấy ngôn ngữ mặc định từ localStorage hoặc trình duyệt
const getDefaultLocale = () => {
  const saved = localStorage.getItem('language');
  if (saved && ['vi', 'en'].includes(saved)) {
    return saved;
  }
  
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'vi' ? 'vi' : 'en';
};

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'vi',
  messages
});

export default i18n;

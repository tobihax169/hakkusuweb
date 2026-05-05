import { createI18n } from 'vue-i18n';
import vi from './vi.json';
import en from './en.json';

const messages = {
  vi,
  en
};

// Ưu tiên giao diện tiếng Việt cho toàn bộ ứng dụng.
const getDefaultLocale = () => {
  const saved = localStorage.getItem('language');
  if (saved && ['vi', 'en'].includes(saved)) {
    // Chuẩn hoá về tiếng Việt trong giai đoạn Việt hoá UI.
    return 'vi';
  }

  return 'vi';
};

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'vi',
  messages
});

export default i18n;

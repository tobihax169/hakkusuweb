import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', () => {
  // State
  const theme = ref(localStorage.getItem('theme') || 'dark');

  // Getters
  const isDark = computed(() => {
    if (theme.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme.value === 'dark';
  });

  const currentTheme = computed(() => theme.value);

  // Actions
  const setTheme = (newTheme) => {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    applyTheme();
  };

  const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const applyTheme = () => {
    const html = document.documentElement;
    
    if (theme.value === 'dark') {
      html.classList.add('dark');
    } else if (theme.value === 'light') {
      html.classList.remove('dark');
    } else {
      // Auto - theo hệ thống
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  };

  const init = () => {
    applyTheme();
    
    // Lắng nghe thay đổi hệ thống khi ở chế độ auto
    if (theme.value === 'auto') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
    }
  };

  // Watch và áp dụng theme khi thay đổi
  watch(theme, applyTheme, { immediate: true });

  return {
    theme,
    isDark,
    currentTheme,
    setTheme,
    toggleTheme,
    init
  };
});

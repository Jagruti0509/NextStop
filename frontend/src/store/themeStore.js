import { create } from 'zustand';

const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem('nextstop_theme') || 'dark', // default to modern dark mode

  initTheme: () => {
    const currentTheme = get().theme;
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('nextstop_theme', nextTheme);
    set({ theme: nextTheme });
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
}));

export default useThemeStore;

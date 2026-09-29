import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeId = 'cashmere' | 'sage' | 'champagne' | 'slate';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  badge: string;
  previewColor: string;
  bgClass: string;
  bgHex: string;
  navbarBg: string;
  cardBg: string;
  textPrimary: string;
  textMuted: string;
  borderColor: string;
  accent: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  cashmere: {
    id: 'cashmere',
    name: 'Warm Cashmere',
    badge: 'Honey Amber',
    previewColor: '#f7efe2',
    bgClass: 'theme-cashmere',
    bgHex: '#f7efe2',
    navbarBg: 'bg-[#f7efe2]/90 backdrop-blur-md',
    cardBg: 'bg-white',
    textPrimary: 'text-slate-950',
    textMuted: 'text-slate-600',
    borderColor: 'border-amber-200/60',
    accent: '#047857',
  },
  sage: {
    id: 'sage',
    name: 'Emerald Sage',
    badge: 'Botanical Mint',
    previewColor: '#edf6f1',
    bgClass: 'theme-sage',
    bgHex: '#edf6f1',
    navbarBg: 'bg-[#edf6f1]/90 backdrop-blur-md',
    cardBg: 'bg-white',
    textPrimary: 'text-slate-950',
    textMuted: 'text-slate-600',
    borderColor: 'border-emerald-200/70',
    accent: '#047857',
  },
  champagne: {
    id: 'champagne',
    name: 'Sunset Champagne',
    badge: 'Rose Quartz',
    previewColor: '#faf1ea',
    bgClass: 'theme-champagne',
    bgHex: '#faf1ea',
    navbarBg: 'bg-[#faf1ea]/90 backdrop-blur-md',
    cardBg: 'bg-white',
    textPrimary: 'text-slate-950',
    textMuted: 'text-slate-600',
    borderColor: 'border-rose-200/60',
    accent: '#b45309',
  },
  slate: {
    id: 'slate',
    name: 'Royal Midnight',
    badge: 'Obsidian & Gold',
    previewColor: '#0b1120',
    bgClass: 'theme-slate',
    bgHex: '#0b1120',
    navbarBg: 'bg-[#0b1120]/95 backdrop-blur-md',
    cardBg: 'bg-slate-900',
    textPrimary: 'text-white',
    textMuted: 'text-slate-400',
    borderColor: 'border-slate-800',
    accent: '#10b981',
  },
};

interface ThemeContextType {
  theme: ThemeId;
  themeConfig: ThemeConfig;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('trendmart_theme');
      if (saved && saved in THEMES) {
        return saved as ThemeId;
      }
    } catch {
      // fallback
    }
    return 'cashmere';
  });

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('trendmart_theme', newTheme);
    } catch {
      // storage unavailable
    }
  };

  const themeConfig = THEMES[theme] || THEMES.cashmere;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = themeConfig.bgHex;
  }, [theme, themeConfig]);

  return (
    <ThemeContext.Provider value={{ theme, themeConfig, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

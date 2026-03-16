import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  mounted: boolean;
  toggleTheme: () => void;
};

const STORAGE_KEY = 'smart-event-theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') {
	return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') {
	return;
  }

  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
	const storedTheme = window.localStorage.getItem(STORAGE_KEY);
	const initialTheme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : getSystemTheme();

	setTheme(initialTheme);
	applyTheme(initialTheme);
	setMounted(true);
  }, []);

  useEffect(() => {
	if (!mounted) {
	  return;
	}

	applyTheme(theme);
	window.localStorage.setItem(STORAGE_KEY, theme);
  }, [mounted, theme]);

  useEffect(() => {
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

	const handleChange = (event: MediaQueryListEvent) => {
	  if (window.localStorage.getItem(STORAGE_KEY)) {
		return;
	  }

	  const nextTheme: Theme = event.matches ? 'dark' : 'light';
	  setTheme(nextTheme);
	  applyTheme(nextTheme);
	};

	mediaQuery.addEventListener('change', handleChange);

	return () => {
	  mediaQuery.removeEventListener('change', handleChange);
	};
  }, []);

  const toggleTheme = useCallback(() => {
	setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
	() => ({
	  theme,
	  mounted,
	  toggleTheme,
	}),
	[mounted, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
	throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}


import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

export type Theme = 'light' | 'dark' | 'pinklight' | 'pinkdark';

export const THEME_OPTIONS: Array<{ value: Theme; label: string }> = [
    {value: 'light', label: 'Clair'},
    {value: 'dark', label: 'Sombre'},
    {value: 'pinklight', label: 'Rose claire'},
    {value: 'pinkdark', label: 'Rose sombre'},
];

type ThemeContextValue = {
    theme: Theme;
    mounted: boolean;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = 'smart-event-theme';
const ROOT_THEME_CLASSES = ['dark', 'pink-light', 'pink-dark'];

const ROOT_CLASS_BY_THEME: Record<Theme, string | null> = {
    light: null,
    dark: 'dark',
    pinklight: 'pink-light',
    pinkdark: 'pink-dark',
};

const COLOR_SCHEME_BY_THEME: Record<Theme, 'light' | 'dark'> = {
    light: 'light',
    dark: 'dark',
    pinklight: 'light',
    pinkdark: 'dark',
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const parseTheme = (value: string | null): Theme | null => {
    if (value === 'pink') {
        return 'pinklight';
    }

    if (value === 'light' || value === 'dark' || value === 'pinklight' || value === 'pinkdark') {
        return value;
    }

    return null;
};

const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return parseTheme(window.localStorage.getItem(STORAGE_KEY)) ?? getSystemTheme();
};

const applyTheme = (theme: Theme) => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.remove(...ROOT_THEME_CLASSES);
    const rootClass = ROOT_CLASS_BY_THEME[theme];
    if (rootClass) {
        document.documentElement.classList.add(rootClass);
    }
    document.documentElement.style.colorScheme = COLOR_SCHEME_BY_THEME[theme];
};

export function ThemeProvider({children}: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const mounted = true;

    useEffect(() => {
        applyTheme(theme);
        window.localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (event: MediaQueryListEvent) => {
            if (parseTheme(window.localStorage.getItem(STORAGE_KEY))) {
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
        setTheme((currentTheme) => {
            const currentIndex = THEME_OPTIONS.findIndex(({value}) => value === currentTheme);
            const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
            return THEME_OPTIONS[nextIndex].value;
        });
    }, []);

    const value = useMemo(
        () => ({
            theme,
            mounted,
            toggleTheme,
            setTheme,
        }),
        [theme, toggleTheme],
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


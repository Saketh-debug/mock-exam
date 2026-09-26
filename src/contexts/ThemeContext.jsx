import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem('student-theme') || 'dark';
        } catch {
            return 'dark';
        }
    });

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('student-theme', theme);
        } catch {
            // localStorage not available
        }
    }, [theme]);

    const toggleTheme = useCallback((event) => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                document.documentElement.setAttribute('data-theme', newTheme);
                setTheme(newTheme);
            });
        } else {
            document.documentElement.classList.add('theme-transitioning');
            setTheme(newTheme);
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transitioning');
            }, 500);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContext;

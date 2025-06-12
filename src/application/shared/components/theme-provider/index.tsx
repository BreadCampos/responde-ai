import { createContext, useEffect, useState, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Theme = "light" | "dark";

interface ThemeProviderState {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeProviderContext = createContext<
  ThemeProviderState | undefined
>(undefined);

export function ThemeProvider({ children, ...props }: { children: ReactNode }) {
  // Inicia o tema com base no localStorage ou preferência do sistema
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("theme") as Theme | null;
      if (savedTheme) {
        return savedTheme;
      }
      // Verifica a preferência do sistema operacional
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return prefersDark ? "dark" : "light";
    }
    // Valor padrão para renderização no servidor (SSR)
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove a classe antiga e adiciona a nova
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Salva a preferência no localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        {...props}
      >
        {children}
      </NextThemesProvider>
    </ThemeProviderContext.Provider>
  );
}

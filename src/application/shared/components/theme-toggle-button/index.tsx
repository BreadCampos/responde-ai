"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/use-theme";

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-foreground bg-transparent hover:bg-muted"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-slate-800" />
      ) : (
        <Sun className="h-5 w-5 text-slate-200" />
      )}
    </button>
  );
}

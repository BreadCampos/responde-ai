import type { ReactNode } from "react";
import { ThemeToggleButton } from "../../components/theme-toggle-button";

interface Props {
  children: ReactNode;
}

const AuthFormLayout = ({ children }: Props) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="relative w-full max-w-md p-6 bg-card text-card-foreground rounded-lg border border-border">
        <div className="absolute top-4 right-4">
          <ThemeToggleButton />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthFormLayout;

import { useAuthStore } from "@/application/feature/authentication/store/use-auth.store";
import { ThemeToggleButton } from "@/application/shared/components/theme-toggle-button";

export const Header = () => {
  const { user } = useAuthStore();

  return (
    <header className="bg-card text-foreground shadow-md p-4 z-10">
      <div className="flex items-center justify-end">
        <span className="text-card-foreground font-medium">
          {user?.firstName}
        </span>
        <ThemeToggleButton />
      </div>
    </header>
  );
};

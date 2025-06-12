import { useAuthStore } from "@/application/feature/authentication/store/use-auth.store";
import { Button } from "@/application/shared/components/button";
import usePersistentState from "@/application/shared/hooks/use-persist";
import { cn } from "@/application/shared/lib/utils";
import { ROUTES } from "@/core/routes/route-constants";
import {
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Webhook,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
type NavItemProps = {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isCollapsed: boolean;
  isLogout?: boolean;
};
const mainLinks = [
  { name: "Formulários", href: ROUTES.SURVEY_LIST, icon: FileText },
  { name: "Webhooks", href: ROUTES.REGISTER, icon: Webhook },
];

const NavItem = ({
  name,
  href,
  icon: Icon,
  isLogout,
  isCollapsed,
}: NavItemProps) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleClick = () => {
    if (isLogout) {
      logout();
      return;
    }
    navigate(href);
  };
  return (
    <Button
      onClick={handleClick}
      variant={isLogout ? "destructive" : "outline"}
      className={isCollapsed ? "justify-center" : "justify-start"}
    >
      <Icon size={isCollapsed ? 24 : 18} className={cn("flex-shrink-0")} />
      {!isCollapsed && (
        <p className={cn("text-lg truncate", isLogout && "text-white")}>
          {name}
        </p>
      )}
    </Button>
  );
};

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = usePersistentState(
    "sidebar-collapsed",
    false
  );

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  return (
    <aside
      className={cn(
        "h-screen  shadow-md bg-card p-4 flex flex-col justify-between transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64 text-foreground",
        "text-foreground dark:text-white"
      )}
    >
      <div>
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <h3 className="text-2xl font-bold ml-2 text-card-foreground">
              Company
            </h3>
          )}
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-card-foreground/10"
          >
            {isCollapsed ? (
              <ChevronsRight className="h-6 w-6" />
            ) : (
              <ChevronsLeft className="h-6 w-6 " />
            )}
          </Button>
        </div>

        <nav className="flex flex-col space-y-2 mt-10">
          {mainLinks.map((link) => (
            <NavItem {...link} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>

      <div className="flex flex-col space-y-2">
        <NavItem
          name={"Logout"}
          href={"logout"}
          isLogout={true}
          icon={LogOut}
          isCollapsed={isCollapsed}
        />
      </div>
    </aside>
  );
};

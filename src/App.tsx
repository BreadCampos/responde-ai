import { Toaster } from "@/application/shared/components/ui/sonner";
import "./globals.css";
import { makeRoutes } from "./core/routes/make-router";
import { useMakeRoutes } from "./core/routes/make-drawer-routes";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./application/shared/components/theme-provider";

function AppContent() {
  const routes = useMakeRoutes();
  return makeRoutes(routes);
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Toaster />
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

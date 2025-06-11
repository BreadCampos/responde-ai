import { Toaster } from "@/application/shared/components/ui/sonner";
import "./globals.css";
import { makeRoutes } from "./core/routes/make-router";
import { useMakeRoutes } from "./core/routes/make-drawer-routes";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./application/shared/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function AppContent() {
  const routes = useMakeRoutes();
  return makeRoutes(routes);
}
const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <AppContent />
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

import { SonnerToaster } from "./components/ui/feedback";
import { useEffect } from "react";
import { getSession } from "./api/session";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Courses from "./pages/Courses";
import Profile from "./pages/Profile";
import Chats from "./pages/Chats";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthRedirector({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/auth") return;
    const user = getSession();
    if (!user) {
      navigate("/auth");
    }
  }, [navigate, location.pathname]);
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SonnerToaster />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <AuthRedirector>
                <Index />
              </AuthRedirector>
            }
          />
          <Route
            path="/courses"
            element={
              <AuthRedirector>
                <Courses />
              </AuthRedirector>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthRedirector>
                <Profile />
              </AuthRedirector>
            }
          />
          <Route
            path="/chats"
            element={
              <AuthRedirector>
                <Chats />
              </AuthRedirector>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

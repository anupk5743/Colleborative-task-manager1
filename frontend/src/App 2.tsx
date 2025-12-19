import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthPage from "./pages/Auth";
import DashboardPage from "./pages/Dashboard";
import "./App.css";

const queryClient = new QueryClient();

/**
 * Protected Route Component
 * Redirects to login if no token is found
 */
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/auth/login" replace />;
};

/**
 * Main App Component
 * Sets up routing and global providers
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;


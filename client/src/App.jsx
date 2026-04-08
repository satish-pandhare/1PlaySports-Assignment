import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

function AppContent() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState("login");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    if (authMode === "register") {
      return <RegisterPage onSwitchToLogin={() => setAuthMode("login")} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthMode("register")} />;
  }

  return (
    <TaskProvider>
      <DashboardPage />
    </TaskProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

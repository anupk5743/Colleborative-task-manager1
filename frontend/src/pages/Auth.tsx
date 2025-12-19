import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import type { User } from "../types";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

type AuthMode = "login" | "register";

/**
 * Auth Page
 * Handles user login and registration
 */
const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        if (response.data.success) {
          navigate("/dashboard");
        }
      } catch {
        // Not logged in, stay on auth page
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLoginSuccess = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  };

  const handleRegisterSuccess = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Task Manager
          </h1>
          <p className="text-gray-600">
            Collaborate and manage tasks in real-time
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {mode === "login" ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Sign In
              </h2>
              <LoginForm onSuccess={handleLoginSuccess} />
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setMode("register")}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create Account
              </h2>
              <RegisterForm onSuccess={handleRegisterSuccess} />
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

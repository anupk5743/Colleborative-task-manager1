import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "../api/axios";
import type { User } from "../types";
import type { AxiosError } from "axios";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess: (user: User) => void;
}

/**
 * Register Form Component
 * Handles user registration with name, email, and password
 */
const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  // Shape of an individual API error item
  type ApiErrorDetail = { message?: string; [key: string]: unknown };

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage("");
    try {
      const { confirmPassword: _, ...submitData } = data;
      console.log("Submitting registration data:", submitData);
      const response = await axiosInstance.post("/auth/register", submitData);

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        onSuccess(response.data.data);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const axiosError = error as AxiosError<{ message?: string; errors?: ApiErrorDetail[] }>;

      // Log detailed error information
      console.log("Error response:", axiosError.response?.data);
      console.log("Error status:", axiosError.response?.status);
      console.log("Error message:", axiosError.message);

      const apiMessage = axiosError.response?.data?.message;
      const apiErrors = axiosError.response?.data?.errors;

      if (apiMessage) {
        setErrorMessage(apiMessage);
      } else if (apiErrors && Array.isArray(apiErrors)) {
        const errorsList = apiErrors
          .map((err) => err.message ?? JSON.stringify(err))
          .join(", ");
        setErrorMessage(errorsList || "Registration failed. Please try again.");
      } else if (axiosError.message === "Network Error") {
        setErrorMessage("Cannot connect to server. Make sure the backend is running on http://localhost:5001");
      } else if (axiosError.message) {
        setErrorMessage(axiosError.message);
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          {...register("name")}
          type="text"
          placeholder="John Doe"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="••••••••"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
};

export default RegisterForm;

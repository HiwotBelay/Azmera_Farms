"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Monitor,
  Shield,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

type AuthMode = "login" | "signup";
type UserRole = "LEARNER" | "CREATOR" | "ADMIN";

export default function UnifiedAuthForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<AuthMode>("login");

  useEffect(() => {
    if (pathname?.includes("/register")) {
      setMode("signup");
    } else {
      setMode("login");
    }
  }, [pathname]);
  const [selectedRole, setSelectedRole] = useState<UserRole>("LEARNER");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    rememberMe: false,
    agreeToTerms: false,
  });

  const roles = [
    {
      value: "LEARNER" as UserRole,
      label: t("auth.learner", "Learner"),
      icon: GraduationCap,
      color: "from-[#01BC63] to-[#059669]",
      bgColor: "bg-[#01BC63]",
    },
    {
      value: "CREATOR" as UserRole,
      label: t("auth.creator", "Creator"),
      icon: Monitor,
      color: "from-[#FFDE59] to-[#FFD700]",
      bgColor: "bg-[#FFDE59]",
    },
    {
      value: "ADMIN" as UserRole,
      label: t("auth.admin", "Admin"),
      icon: Shield,
      color: "from-gray-700 to-gray-900",
      bgColor: "bg-gray-700",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        const { authApi } = await import("@/modules/auth/api/auth.api");
        const response = await authApi.login({
          email: formData.email,
          password: formData.password,
        });

        // Redirect based on user role
        const userRole = response.user.role?.toUpperCase();
        if (userRole === "LEARNER") {
          router.push("/dashboard");
        } else if (userRole === "CREATOR") {
          router.push("/creator/dashboard");
        } else if (userRole === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        const { authApi } = await import("@/modules/auth/api/auth.api");
        const response = await authApi.register({
          email: formData.email,
          password: formData.password,
          firstName: formData.fullName.split(" ")[0] || "",
          lastName: formData.fullName.split(" ").slice(1).join(" ") || "",
          role: selectedRole,
        });

        // Redirect based on selected role
        if (selectedRole === "LEARNER") {
          router.push("/dashboard");
        } else if (selectedRole === "CREATOR") {
          router.push("/creator/dashboard");
        } else if (selectedRole === "ADMIN") {
          router.push("/admin/dashboard");
        }
      }
    } catch (error: any) {
      // Extract error message from response
      let errorMessage = "An error occurred. Please try again.";

      if (error.response?.data?.message) {
        // If it's a single message string
        if (typeof error.response.data.message === "string") {
          errorMessage = error.response.data.message;
        }
        // If it's an array of validation errors
        else if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message.join("\n");
        }
        // If it's an object with error details
        else if (typeof error.response.data.message === "object") {
          const messages = Object.values(error.response.data.message).flat();
          errorMessage = messages.join("\n");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
      console.error("Registration error:", error.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01BC63]/10 via-white to-[#FFDE59]/10 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#01BC63] to-[#059669] p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {mode === "login"
              ? t("auth.loginTitle", "Welcome Back")
              : t("auth.registerTitle", "Join Azemera")}
          </h1>
          <p className="text-white/90 text-sm md:text-base">
            {mode === "login"
              ? t(
                  "auth.loginSubtitle",
                  "Login to continue your learning journey"
                )
              : t(
                  "auth.registerSubtitle",
                  "Create your account to get started"
                )}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-3 font-semibold transition-all duration-200 ${
              mode === "login"
                ? "text-[#01BC63] border-b-2 border-[#01BC63]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("common.login", "Login")}
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-3 font-semibold transition-all duration-200 ${
              mode === "signup"
                ? "text-[#01BC63] border-b-2 border-[#01BC63]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("common.signUp", "Sign Up")}
          </button>
        </div>

        <div className="p-6 md:p-8">
          {/* Role Selection (only for signup) */}
          {mode === "signup" && (
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t("auth.selectRole", "Select Your Role")}
              </label>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`p-3 md:p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? `border-[#01BC63] bg-gradient-to-br ${role.color} text-white shadow-lg scale-105`
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-2" />
                      <span className="text-xs font-semibold block">
                        {role.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (only for signup) */}
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  {t("auth.fullName", "Full Name")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                {t("auth.email", "Email Address")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                {t("auth.password", "Password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {mode === "signup" && (
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, and
                  number
                </p>
              )}
            </div>

            {/* Remember Me / Forgot Password (only for login) */}
            {mode === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#01BC63] border-gray-300 rounded focus:ring-[#01BC63]"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {t("auth.rememberMe", "Remember me")}
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-[#01BC63] hover:underline font-medium"
                >
                  {t("auth.forgotPassword", "Forgot password?")}
                </a>
              </div>
            )}

            {/* Terms and Conditions (only for signup) */}
            {mode === "signup" && (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#01BC63] border-gray-300 rounded focus:ring-[#01BC63] mt-1"
                  required
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  {t(
                    "auth.agreeToTerms",
                    "I agree to the Terms of Service and Privacy Policy"
                  )}
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isLoading || (mode === "signup" && !formData.agreeToTerms)
              }
              className="w-full py-3 md:py-4 bg-gradient-to-r from-[#01BC63] to-[#059669] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#01BC63]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "login"
                    ? t("common.loading", "Logging in...")
                    : t("common.loading", "Creating account...")}
                </>
              ) : (
                <>
                  {mode === "login"
                    ? t("common.login", "Login")
                    : t("common.register", "Create Account")}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

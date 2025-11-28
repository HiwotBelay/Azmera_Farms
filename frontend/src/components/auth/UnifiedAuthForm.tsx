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
  ArrowRight,
  Check,
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
      color: "from-[#01BC63] to-[#00a855]",
      bgColor: "bg-[#01BC63]",
    },
    {
      value: "CREATOR" as UserRole,
      label: t("auth.creator", "Creator"),
      icon: Monitor,
      color: "from-[#FFDE59] to-[#ffd633]",
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
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f0fef9] to-[#e8fdf5] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#01BC63]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFDE59]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border-2 border-gray-100">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-[#01BC63] to-[#00a855] p-8 md:p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#01BC63]/20 to-[#FFDE59]/20"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              {mode === "login"
                ? t("auth.loginTitle", "Welcome Back")
                : t("auth.registerTitle", "Join Azemera")}
            </h1>
            <p className="text-white/90 text-base md:text-lg">
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
        </div>

        {/* Mode Toggle */}
        <div className="flex border-b-2 border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setMode("login")}
            className={`group flex-1 py-4 font-semibold transition-all duration-300 relative ${
              mode === "login"
                ? "text-[#01BC63]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="relative z-10">{t("common.login", "Login")}</span>
            {mode === "login" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#01BC63] to-[#00a855]"></div>
            )}
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`group flex-1 py-4 font-semibold transition-all duration-300 relative ${
              mode === "signup"
                ? "text-[#01BC63]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="relative z-10">
              {t("common.signUp", "Sign Up")}
            </span>
            {mode === "signup" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#01BC63] to-[#00a855]"></div>
            )}
          </button>
        </div>

        <div className="p-6 md:p-8 lg:p-10">
          {/* Role Selection (only for signup) */}
          {mode === "signup" && (
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-4">
                {t("auth.selectRole", "Select Your Role")}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                        isSelected
                          ? `border-[#01BC63] shadow-lg shadow-[#01BC63]/20 scale-105`
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      {/* Gradient Background on Selected */}
                      {isSelected && (
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-10`}
                        ></div>
                      )}
                      <div className="relative z-10">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span
                          className={`text-xs font-bold block ${
                            isSelected ? "text-[#01BC63]" : "text-gray-700"
                          }`}
                        >
                          {role.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#01BC63] rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name (only for signup) */}
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-bold text-gray-900 mb-2"
                >
                  {t("auth.fullName", "Full Name")}
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#01BC63] transition-colors" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 bg-gray-50 hover:bg-white hover:border-gray-300"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                {t("auth.email", "Email Address")}
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#01BC63] transition-colors" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 bg-gray-50 hover:bg-white hover:border-gray-300"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                {t("auth.password", "Password")}
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#01BC63] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 bg-gray-50 hover:bg-white hover:border-gray-300"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#01BC63] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {mode === "signup" && (
                <p className="mt-2 text-xs text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, and
                  number
                </p>
              )}
            </div>

            {/* Remember Me / Forgot Password (only for login) */}
            {mode === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#01BC63] border-gray-300 rounded focus:ring-2 focus:ring-[#01BC63] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    {t("auth.rememberMe", "Remember me")}
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-[#01BC63] hover:text-[#00a855] hover:underline font-semibold transition-colors"
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
                  className="w-5 h-5 text-[#01BC63] border-gray-300 rounded focus:ring-2 focus:ring-[#01BC63] mt-0.5 cursor-pointer"
                  required
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-3 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
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
              className="group relative w-full py-4 bg-gradient-to-r from-[#01BC63] to-[#00a855] text-white rounded-xl font-bold shadow-lg shadow-[#01BC63]/30 hover:shadow-xl hover:shadow-[#01BC63]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:shadow-[#01BC63]/30 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#00a855] to-[#01BC63] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10 flex items-center justify-center gap-2">
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
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

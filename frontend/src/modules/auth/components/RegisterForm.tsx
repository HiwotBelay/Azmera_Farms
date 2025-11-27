"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface RegisterFormProps {
  role: "LEARNER" | "CREATOR";
}

export default function RegisterForm({ role }: RegisterFormProps) {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    organization: "",
    bio: "",
    expertiseArea: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Split fullName into firstName and lastName
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await register({
        email: formData.email,
        password: formData.password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        role: role,
      });

      if (role === "CREATOR") {
        router.push("/creator/application");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Creator-specific fields */}
      {role === "CREATOR" && (
        <>
          <div>
            <label htmlFor="expertiseArea" className="block text-sm font-medium text-gray-700 mb-2">
              Expertise Area
            </label>
            <select
              id="expertiseArea"
              value={formData.expertiseArea}
              onChange={(e) => setFormData({ ...formData, expertiseArea: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Select your expertise</option>
              <option value="crop-production">Crop Production</option>
              <option value="livestock">Livestock Management</option>
              <option value="agribusiness">Agribusiness</option>
              <option value="sustainable-farming">Sustainable Farming</option>
            </select>
          </div>
        </>
      )}

      {/* Terms and Conditions */}
      <div className="flex items-start">
        <input
          type="checkbox"
          id="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
          required
        />
        <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
          I agree to the{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !formData.agreeToTerms}
        className={`w-full py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
          role === "CREATOR"
            ? "bg-accent-yellow text-gray-800 hover:bg-yellow-400"
            : "bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}




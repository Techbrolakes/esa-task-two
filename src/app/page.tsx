"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EyeOff, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { setUser } from "@/utils/storage";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(50, "Password must not exceed 50 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUser({
        username: data.username,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
      });

      toast.success("Login successful!");
      router.push("/companies");
      reset();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-blue-950 to-slate-900 animate-gradient-x">
      {/* Form Container */}
      <div className="w-full rounded-tr-2xl rounded-bl-3xl flex flex-col justify-center max-w-lg h-[500px] p-8 space-y-12 bg-white shadow-md transform transition-all duration-300 hover:scale-[1.02]">
        {/* Header */}
        <h1 className="text-4xl text-center font-bold bg-gradient-to-r from-blue-600 to-slate-800 bg-clip-text text-transparent">
          Welcome Back
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative">
          {/* Username Field */}
          <div className="space-y-2  text-sm opacity-80 ">
            <label className="font-medium">Enter Username</label>
            <input
              type="text"
              {...register("username")}
              className={`w-full px-5 py-3 rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white`}
              placeholder="Enter your username"
            />

            {errors.username && <p className="text-sm text-red-500 ml-1">{errors.username.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="relative group">
              <div className="space-y-2  text-sm opacity-80 ">
                <label className="font-medium">Enter Username</label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full px-5 py-3 rounded-lg border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white`}
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500 ml-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 
              ${
                isLoading
                  ? "bg-gradient-to-l from-blue-700 to-slate-800 hover:from-blue-800 hover:to-slate-900 transform hover:-translate-y-0.5 shadow-lg"
                  : "bg-gradient-to-r from-blue-700 to-slate-800 hover:from-blue-800 hover:to-slate-900 transform hover:-translate-y-0.5 shadow-lg"
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

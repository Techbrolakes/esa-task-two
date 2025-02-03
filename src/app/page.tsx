"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { setUser } from "@/utils/storage";
import { useRouter } from "next/navigation";
import FormInput from "@/components/form/FormInput";

const loginSchema = z.object({
  fullname: z.string().min(1, "Fullname is required"),
  email: z.string().email("Invalid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
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
        fullname: data.fullname,
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-[#060C21] to-black animate-gradient-x">
      {/* Form Container */}
      <div className="w-full rounded-tr-2xl rounded-bl-3xl flex flex-col justify-center max-w-lg h-[500px] p-8 space-y-12 bg-white shadow-md transform transition-all duration-300 hover:scale-[1.02]">
        {/* Header */}
        <h1 className="text-4xl text-center font-bold bg-gradient-to-r from-blue-600 to-slate-800 bg-clip-text text-transparent">
          Welcome Back
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative">
          <FormInput
            label="Enter Full name"
            register={register}
            name="fullname"
            error={errors.fullname}
            placeholder="Enter your fullname"
          />

          <FormInput
            label="Enter Email"
            register={register}
            name="email"
            type="email"
            error={errors.email}
            placeholder="Enter your email"
          />

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

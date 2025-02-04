import { CircleAlert } from "lucide-react";
import React from "react";
import { UseFormRegister, FieldError, Path, RegisterOptions } from "react-hook-form";

export interface FancyInputProps<TFormValues extends object> {
  label?: string;
  error?: FieldError;
  register: UseFormRegister<TFormValues>;
  name: Path<TFormValues>;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "date";
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  registerOptions?: RegisterOptions;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  autoComplete?: string;
}

const FancyInput = <TFormValues extends object>({
  label,
  error,
  name,
  type = "text",
  placeholder,
  className = "",
  disabled = false,
  required = false,
  register,
  helperText,
  startIcon,
  endIcon,
  autoComplete,
}: FancyInputProps<TFormValues>) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name as string} className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {startIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{startIcon}</div>}

        <input
          id={name as string}
          type={type}
          autoComplete={autoComplete}
          disabled={disabled}
          {...register(name)}
          className={`
            w-full bg-gray-800/40 border 
            ${error ? "border-red-500/50 focus:ring-red-500/30" : "border-gray-700 focus:ring-blue-500/30"} 
            rounded-lg
            ${startIcon ? "pl-10" : "pl-4"} 
            ${endIcon ? "pr-10" : "pr-4"} 
            py-2.5
            text-white 
            placeholder-gray-500
            focus:outline-none 
            focus:ring-2 
            transition-all 
            duration-200
            disabled:opacity-50 
            disabled:cursor-not-allowed
            hover:border-gray-600
            ${className}
          `}
          placeholder={placeholder}
        />

        {endIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{endIcon}</div>}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-1.5">
          <div className="text-red-400 mt-0.5">
          <CircleAlert size={16} />
          </div>
          <p className="text-red-400 text-sm">{error.message}</p>
        </div>
      )}

      {/* Helper text */}
      {helperText && !error && <p className="text-gray-400 text-sm">{helperText}</p>}
    </div>
  );
};

export default FancyInput;

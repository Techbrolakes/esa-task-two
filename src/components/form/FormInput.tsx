import { UseFormRegister, FieldError, Path } from "react-hook-form";

export interface FormInputProps<TFormValues extends object> {
  label?: string;
  error?: FieldError;
  register: UseFormRegister<TFormValues>;
  name: Path<TFormValues>;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const FormInput = <TFormValues extends object>({
  label,
  error,
  register,
  name,
  type,
  placeholder,
  className = "",
  disabled = false,
}: FormInputProps<TFormValues>) => {
  return (
    <div className="space-y-2 text-sm">
      {label && <label className="font-medium">{label}</label>}
      <input
        type={type}
        {...register(name)}
        disabled={disabled}
        className={`w-full px-5 py-3 rounded-md border text-gray-900
          ${error ? "border-red-500" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-blue-600 
          focus:border-transparent transition-all duration-200 
          bg-gray-50 hover:bg-white 
          ${disabled ? "bg-gray-50 cursor-not-allowed opacity-90" : "hover:bg-white"}
          ${className}`}
        placeholder={placeholder}
      />
      {error && <p className="text-sm font-medium text-red-500 ml-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;

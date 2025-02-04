import React from "react";
import PhoneInput from "react-phone-number-input";
import { Controller, Control, FieldError, Path } from "react-hook-form";
import { CircleAlert } from "lucide-react";
import "react-phone-number-input/style.css";
import "../../theme/phone-input.css";

interface PhoneInputFieldProps<TFormValues extends object> {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  required?: boolean;
  error?: FieldError;
  placeholder?: string;
}

const PhoneInputField = <TFormValues extends object>({
  control,
  name,
  label,
  required = false,
  error,
  placeholder = "Enter phone number",
}: PhoneInputFieldProps<TFormValues>) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field: { onChange, value } }) => (
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry="NG"
            value={value as string}
            onChange={onChange}
            className="w-full bg-gray-800/40 border border-gray-700 rounded-lg text-white"
            placeholder={placeholder}
            limitMaxLength={true}
          />
        )}
      />

      {error && (
        <div className="flex items-start gap-1.5">
          <div className="text-red-400 mt-0.5">
            <CircleAlert size={16} />
          </div>
          <p className="text-red-400 text-sm">{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default PhoneInputField;

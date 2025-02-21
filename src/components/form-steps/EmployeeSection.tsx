"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Users } from "lucide-react";
import FancyInput from "@/components/form/FancyInput";
import { CompanyFormData } from "@/lib/validations";

interface EmployeeSectionProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  watch: UseFormWatch<CompanyFormData>;
  setValue: UseFormSetValue<CompanyFormData>;
}

const EmployeeSection = ({ register, errors }: EmployeeSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FancyInput<CompanyFormData>
          label="Full-Time Employees"
          name="employees.numberOfFullTimeEmployees"
          type="number"
          register={register}
          error={errors.employees?.numberOfFullTimeEmployees}
          placeholder="Enter number"
          required
          startIcon={<Users className="w-4 h-4" />}
        />
        <FancyInput<CompanyFormData>
          label="Part-Time Employees"
          name="employees.numberOfPartTimeEmployees"
          type="number"
          register={register}
          error={errors.employees?.numberOfPartTimeEmployees}
          placeholder="Enter number"
          required
          startIcon={<Users className="w-4 h-4" />}
        />
      </div>

      <FancyInput<CompanyFormData>
        label="Total Employees"
        name="employees.totalNumberOfEmployees"
        type="number"
        register={register}
        error={errors.employees?.totalNumberOfEmployees}
        placeholder="Total will be calculated"
        disabled
        startIcon={<Users className="w-4 h-4" />}
      />

      <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-2">Additional Information (optional)</label>
        <textarea
          {...register("employees.otherInformation")}
          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
          rows={4}
          placeholder="Enter any additional information about the company"
        />
      </div>
    </div>
  );
};

export default EmployeeSection;

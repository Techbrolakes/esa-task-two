"use client";

import React from "react";
import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { UserCircle, Mail } from "lucide-react";
import FancyInput from "@/components/form/FancyInput";
import PhoneInputField from "../form/PhoneInputField";
import { CompanyFormData } from "@/lib/validations";

interface ContactSectionProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  control: Control<CompanyFormData>;
}

const ContactSection = ({ register, errors, control }: ContactSectionProps) => {
  return (
    <div className="p-6 bg-gray-800/40 rounded-lg border border-gray-700 space-y-6">
      <h3 className="text-lg font-semibold text-white">Primary Contact Person</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FancyInput<CompanyFormData>
          label="First Name"
          name="primaryContactPerson.firstName"
          register={register}
          error={errors.primaryContactPerson?.firstName}
          placeholder="Enter first name"
          required
          startIcon={<UserCircle className="w-4 h-4" />}
        />
        <FancyInput<CompanyFormData>
          label="Last Name"
          name="primaryContactPerson.lastName"
          register={register}
          error={errors.primaryContactPerson?.lastName}
          placeholder="Enter last name"
          required
          startIcon={<UserCircle className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FancyInput<CompanyFormData>
          label="Email"
          name="primaryContactPerson.email"
          type="email"
          register={register}
          error={errors.primaryContactPerson?.email}
          placeholder="contact@example.com"
          required
          startIcon={<Mail className="w-4 h-4" />}
        />
        <PhoneInputField
          control={control}
          name="primaryContactPerson.phone"
          label="Phone"
          required
          error={errors.primaryContactPerson?.phone}
        />
      </div>
    </div>
  );
};

export default ContactSection;

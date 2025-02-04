"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserCircle, Mail, Phone } from "lucide-react";
import { CompanyFormData } from "@/components/validations";
import FancyInput from "@/components/form/FancyInput";

interface ContactSectionProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
}

const ContactSection = ({ register, errors }: ContactSectionProps) => {
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
        <FancyInput<CompanyFormData>
          label="Phone"
          name="primaryContactPerson.phone"
          type="number"
          register={register}
          error={errors.primaryContactPerson?.phone}
          placeholder="+1 (555) 000-0000"
          required
          startIcon={<Phone className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};

export default ContactSection;

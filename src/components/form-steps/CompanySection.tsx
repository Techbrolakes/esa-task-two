"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, Control } from "react-hook-form";
import { Building2, Mail, Phone, Globe, MapPinIcon } from "lucide-react";
import FancyInput from "@/components/form/FancyInput";
import LogoUploader from "@/components/LogoUploader";
import LinkedinIcon from "@/icons/LinkedinIcon";
import FacebookIcon from "@/icons/FacebookIcon";
import PhoneInputField from "../form/PhoneInputField";
import { CompanyFormData } from "@/lib/validations";

interface CompanySectionProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  watch: UseFormWatch<CompanyFormData>;
  setValue: UseFormSetValue<CompanyFormData>;
  initialLogoKey: string | null;
  control: Control<CompanyFormData>;
}

const CompanySection = ({ register, errors, watch, setValue, initialLogoKey, control }: CompanySectionProps) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-700">
        <LogoUploader
          onUploadComplete={(key) => {
            setValue("logoS3Key", key, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
          initialLogoKey={watch("logoS3Key") || (initialLogoKey as string)}
          error={errors.logoS3Key}
          label="Company Logo"
        />
      </div>

      <FancyInput<CompanyFormData>
        label="Legal Name"
        name="legalName"
        register={register}
        error={errors.legalName}
        placeholder="Enter legal company name"
        required
        startIcon={<Building2 className="w-4 h-4" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FancyInput<CompanyFormData>
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="company@example.com"
          required
          startIcon={<Mail className="w-4 h-4" />}
        />
        <PhoneInputField
          control={control} 
          name="phone"
          label="Phone"
          required
          error={errors.phone}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FancyInput<CompanyFormData>
          label="Website"
          name="website"
          register={register}
          error={errors.website}
          placeholder="https://www.company.com"
          startIcon={<Globe className="w-4 h-4" />}
        />
        <FancyInput<CompanyFormData>
          label="Fax"
          name="fax"
          type="number"
          register={register}
          error={errors.fax}
          placeholder="Enter fax number"
          startIcon={<Phone className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FancyInput<CompanyFormData>
          label="Industry"
          name="industry"
          register={register}
          error={errors.industry}
          placeholder="Enter company industry"
          required
          startIcon={<Building2 className="w-4 h-4" />}
        />
        <FancyInput<CompanyFormData>
          label="State of Incorporation"
          name="stateOfIncorporation"
          register={register}
          error={errors.stateOfIncorporation}
          placeholder="Enter state"
          required
          startIcon={<MapPinIcon className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FancyInput<CompanyFormData>
          label="Facebook Page"
          name="facebookCompanyPage"
          register={register}
          error={errors.facebookCompanyPage}
          placeholder="Facebook URL"
          startIcon={<FacebookIcon className="w-4 h-4" />}
        />
        <FancyInput<CompanyFormData>
          label="LinkedIn Page"
          name="linkedInCompanyPage"
          register={register}
          error={errors.linkedInCompanyPage}
          placeholder="LinkedIn URL"
          startIcon={<LinkedinIcon className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};

export default CompanySection;

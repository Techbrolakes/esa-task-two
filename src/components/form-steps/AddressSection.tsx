"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { Home, MapPinIcon, Globe, Hash } from "lucide-react";
import { CompanyFormData } from "@/components/validations";
import FancyInput from "@/components/form/FancyInput";

interface AddressSectionProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  watch: UseFormWatch<CompanyFormData>;
}

const AddressSection = ({ register, errors }: AddressSectionProps) => {
  //   const isDifferentMailingAddress = watch("isMailingAddressDifferentFromRegisteredAddress");

  return (
    <div className="space-y-8">
      {/* Registered Address */}
      <div className="p-6 bg-gray-800/40 rounded-lg border border-gray-700 space-y-6">
        <h3 className="text-lg font-semibold text-white">Registered Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FancyInput<CompanyFormData>
            label="Street"
            name="registeredAddress.street"
            register={register}
            error={errors.registeredAddress?.street}
            placeholder="Enter street address"
            required
            startIcon={<Home className="w-4 h-4" />}
          />
          <FancyInput<CompanyFormData>
            label="City"
            name="registeredAddress.city"
            register={register}
            error={errors.registeredAddress?.city}
            placeholder="Enter city"
            required
            startIcon={<MapPinIcon className="w-4 h-4" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FancyInput<CompanyFormData>
            label="State"
            name="registeredAddress.state"
            register={register}
            error={errors.registeredAddress?.state}
            placeholder="Enter state"
            required
            startIcon={<MapPinIcon className="w-4 h-4" />}
          />
          <FancyInput<CompanyFormData>
            label="Country"
            name="registeredAddress.country"
            register={register}
            error={errors.registeredAddress?.country}
            placeholder="Enter country"
            required
            startIcon={<Globe className="w-4 h-4" />}
          />
          <FancyInput<CompanyFormData>
            label="Zip Code"
            name="registeredAddress.zipCode"
            type="number"
            register={register}
            error={errors.registeredAddress?.zipCode}
            placeholder="Enter zip code"
            required
            startIcon={<Hash className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Mailing Address */}
      <div className="p-6 bg-gray-800/40 rounded-lg border border-gray-700 space-y-6">
        <h3 className="text-lg font-semibold text-white">Mailing Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FancyInput<CompanyFormData>
            label="Street"
            name="mailingAddress.street"
            register={register}
            error={errors.mailingAddress?.street}
            placeholder="Enter street address"
            required
            startIcon={<Home className="w-4 h-4" />}
          />
          <FancyInput<CompanyFormData>
            label="City"
            name="mailingAddress.city"
            register={register}
            error={errors.mailingAddress?.city}
            placeholder="Enter city"
            required
            startIcon={<MapPinIcon className="w-4 h-4" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FancyInput<CompanyFormData>
            label="State"
            name="mailingAddress.state"
            register={register}
            error={errors.mailingAddress?.state}
            placeholder="Enter state"
            required
            startIcon={<MapPinIcon className="w-4 h-4" />}
          />
          <FancyInput<CompanyFormData>
            label="Country"
            name="mailingAddress.country"
            register={register}
            error={errors.mailingAddress?.country}
            placeholder="Enter country"
            required
            startIcon={<Globe className="w-4 h-4" />}
          />
          <FancyInput<CompanyFormData>
            label="Zip Code"
            type="number"
            name="mailingAddress.zipCode"
            register={register}
            error={errors.mailingAddress?.zipCode}
            placeholder="Enter zip code"
            required
            startIcon={<Hash className="w-4 h-4" />}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-800/40 rounded-lg border border-gray-700">
        <input
          type="checkbox"
          {...register("isMailingAddressDifferentFromRegisteredAddress")}
          className="w-4 h-4 rounded border-gray-700 text-blue-500 focus:ring-blue-500/50"
        />
        <label className="text-sm font-medium text-gray-300">Mailing address is different from registered address</label>
      </div>
    </div>
  );
};

export default AddressSection;

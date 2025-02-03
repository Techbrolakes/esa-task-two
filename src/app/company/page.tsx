"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import mutations from "@/lib/mutations";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import FormInput from "@/components/form/FormInput";
import LogoUploader from "@/components/LogoUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyFormData, companySchema } from "@/components/validations";

const sections = ["company", "employees", "address", "contact"] as const;

export default function CompanyPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    trigger,
    setValue,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const router = useRouter();
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]>("company");
  const isDifferentMailingAddress = watch("isMailingAddressDifferentFromRegisteredAddress");

  const [createCompany, { loading }] = useMutation(mutations.CREATE_COMPANY, {
    onCompleted: () => {
      reset();
      toast.success("Company created successfully!");
      router.push("/companies");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create company");
    },
  });
  const getCurrentSectionFields = () => {
    switch (activeSection) {
      case "company":
        return ["logoS3Key", "legalName", "email", "phone", "industry", "stateOfIncorporation"] as const;
      case "employees":
        return ["numberOfFullTimeEmployees", "numberOfPartTimeEmployees", "totalNumberOfEmployees"] as const;
      case "address":
        return [
          "registeredAddress.street",
          "registeredAddress.city",
          "registeredAddress.state",
          "registeredAddress.country",
          "registeredAddress.zipCode",
        ] as const;
      case "contact":
        return [
          "primaryContactPerson.firstName",
          "primaryContactPerson.lastName",
          "primaryContactPerson.email",
          "primaryContactPerson.phone",
        ] as const;
      default:
        return [] as const;
    }
  };

  const goToNextSection = async () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      const fieldsToValidate = getCurrentSectionFields();
      const isValid = await trigger(fieldsToValidate);

      if (isValid) {
        setActiveSection(sections[currentIndex + 1]);
      }
    }
  };

  const goToPrevSection = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1]);
    }
  };

  const hasErrorsInSection = (section: (typeof sections)[number]) => {
    switch (section) {
      case "company":
        return !!(
          errors.legalName ||
          errors.logoS3Key ||
          errors.email ||
          errors.phone ||
          errors.website ||
          errors.fax ||
          errors.industry ||
          errors.stateOfIncorporation ||
          errors.facebookCompanyPage ||
          errors.linkedInCompanyPage
        );
      case "employees":
        return !!(
          errors.numberOfFullTimeEmployees ||
          errors.numberOfPartTimeEmployees ||
          errors.totalNumberOfEmployees ||
          errors.otherInformation
        );
      case "address":
        return !!(errors.registeredAddress || errors.mailingAddress || errors.isMailingAddressDifferentFromRegisteredAddress);
      case "contact":
        return !!errors.primaryContactPerson;
      default:
        return false;
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      await createCompany({
        variables: {
          input: {
            email: data.email,
            facebookCompanyPage: data.facebookCompanyPage || null,
            fax: data.fax || null,
            industry: data.industry,
            isMailingAddressDifferentFromRegisteredAddress: Boolean(data.isMailingAddressDifferentFromRegisteredAddress),
            legalName: data.legalName,
            linkedInCompanyPage: data.linkedInCompanyPage || null,
            logoS3Key: data.logoS3Key || null,
            mailingAddress: isDifferentMailingAddress
              ? {
                  city: data.mailingAddress.city,
                  country: data.mailingAddress.country,
                  state: data.mailingAddress.state,
                  street: data.mailingAddress.street,
                  zipCode: data.mailingAddress.zipCode,
                }
              : {
                  city: data.registeredAddress.city,
                  country: data.registeredAddress.country,
                  state: data.registeredAddress.state,
                  street: data.registeredAddress.street,
                  zipCode: data.registeredAddress.zipCode,
                },
            numberOfFullTimeEmployees: Number(data.numberOfFullTimeEmployees),
            numberOfPartTimeEmployees: Number(data.numberOfPartTimeEmployees),
            otherInformation: data.otherInformation || null,
            phone: data.phone,
            primaryContactPerson: {
              email: data.primaryContactPerson.email,
              firstName: data.primaryContactPerson.firstName,
              lastName: data.primaryContactPerson.lastName,
              phone: data.primaryContactPerson.phone,
            },
            registeredAddress: {
              city: data.registeredAddress.city,
              country: data.registeredAddress.country,
              state: data.registeredAddress.state,
              street: data.registeredAddress.street,
              zipCode: data.registeredAddress.zipCode,
            },
            stateOfIncorporation: data.stateOfIncorporation,
            totalNumberOfEmployees: Number(data.totalNumberOfEmployees),
            website: data.website || null,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "company":
        return (
          <div className="space-y-1">
            <LogoUploader
              onUploadComplete={(key) => setValue("logoS3Key", key)}
              initialLogoKey={watch("logoS3Key")}
              error={errors.logoS3Key}
              label="Company Logo"
            />

            <FormInput<CompanyFormData>
              label="Legal Name"
              name="legalName"
              register={register}
              error={errors.legalName}
              placeholder="Enter legal company name"
            />
            <div className="grid grid-cols-2 gap-6">
              <FormInput<CompanyFormData>
                label="Email"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                placeholder="company@example.com"
              />
              <FormInput<CompanyFormData>
                label="Phone"
                name="phone"
                register={register}
                error={errors.phone}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <FormInput<CompanyFormData>
                label="Website"
                name="website"
                register={register}
                error={errors.website}
                placeholder="https://www.company.com"
              />
              <FormInput<CompanyFormData>
                label="Fax"
                name="fax"
                register={register}
                error={errors.fax}
                placeholder="Enter fax number"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <FormInput<CompanyFormData>
                label="Industry"
                name="industry"
                register={register}
                error={errors.industry}
                placeholder="Enter company industry"
              />
              <FormInput<CompanyFormData>
                label="State of Incorporation"
                name="stateOfIncorporation"
                register={register}
                error={errors.stateOfIncorporation}
                placeholder="Enter state"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <FormInput<CompanyFormData>
                label="Facebook Page"
                name="facebookCompanyPage"
                register={register}
                error={errors.facebookCompanyPage}
                placeholder="Facebook URL"
              />
              <FormInput<CompanyFormData>
                label="LinkedIn Page"
                name="linkedInCompanyPage"
                register={register}
                error={errors.linkedInCompanyPage}
                placeholder="LinkedIn URL"
              />
            </div>
          </div>
        );
      case "employees":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-12">
              <FormInput<CompanyFormData>
                label="Full-Time"
                name="numberOfFullTimeEmployees"
                type="number"
                register={register}
                error={errors.numberOfFullTimeEmployees}
                placeholder="Full-time count"
              />
              <FormInput<CompanyFormData>
                label="Part-Time"
                name="numberOfPartTimeEmployees"
                type="number"
                register={register}
                error={errors.numberOfPartTimeEmployees}
                placeholder="Part-time count"
              />
            </div>

            <FormInput<CompanyFormData>
              label="Total"
              name="totalNumberOfEmployees"
              type="number"
              register={register}
              error={errors.totalNumberOfEmployees}
              placeholder="Total employees"
            />

            <FormInput<CompanyFormData>
              label="Additional Information"
              name="otherInformation"
              register={register}
              error={errors.otherInformation}
              placeholder="Enter any additional information"
            />
          </div>
        );
      case "address":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Registered Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormInput<CompanyFormData>
                  label="Street"
                  name="registeredAddress.street"
                  register={register}
                  error={errors.registeredAddress?.street}
                  placeholder="Street address"
                />
                <FormInput<CompanyFormData>
                  label="City"
                  name="registeredAddress.city"
                  register={register}
                  error={errors.registeredAddress?.city}
                  placeholder="City"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormInput<CompanyFormData>
                  label="State"
                  name="registeredAddress.state"
                  register={register}
                  error={errors.registeredAddress?.state}
                  placeholder="State"
                />
                <FormInput<CompanyFormData>
                  label="Country"
                  name="registeredAddress.country"
                  register={register}
                  error={errors.registeredAddress?.country}
                  placeholder="Country"
                />
                <FormInput<CompanyFormData>
                  label="Zip Code"
                  name="registeredAddress.zipCode"
                  register={register}
                  error={errors.registeredAddress?.zipCode}
                  placeholder="Zip code"
                />
              </div>
            </div>

            <FormInput<CompanyFormData>
              label="Different Mailing Address?"
              name="isMailingAddressDifferentFromRegisteredAddress"
              type="checkbox"
              register={register}
              error={errors.isMailingAddressDifferentFromRegisteredAddress}
            />

            {isDifferentMailingAddress && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Mailing Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput<CompanyFormData>
                    label="Street"
                    name="mailingAddress.street"
                    register={register}
                    error={errors.mailingAddress?.street}
                    placeholder="Street address"
                  />
                  <FormInput<CompanyFormData>
                    label="City"
                    name="mailingAddress.city"
                    register={register}
                    error={errors.mailingAddress?.city}
                    placeholder="City"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormInput<CompanyFormData>
                    label="State"
                    name="mailingAddress.state"
                    register={register}
                    error={errors.mailingAddress?.state}
                    placeholder="State"
                  />
                  <FormInput<CompanyFormData>
                    label="Country"
                    name="mailingAddress.country"
                    register={register}
                    error={errors.mailingAddress?.country}
                    placeholder="Country"
                  />
                  <FormInput<CompanyFormData>
                    label="Zip Code"
                    name="mailingAddress.zipCode"
                    register={register}
                    error={errors.mailingAddress?.zipCode}
                    placeholder="Zip code"
                  />
                </div>
              </div>
            )}
          </div>
        );
      case "contact":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput<CompanyFormData>
                label="First Name"
                name="primaryContactPerson.firstName"
                register={register}
                error={errors.primaryContactPerson?.firstName}
                placeholder="First name"
              />
              <FormInput<CompanyFormData>
                label="Last Name"
                name="primaryContactPerson.lastName"
                register={register}
                error={errors.primaryContactPerson?.lastName}
                placeholder="Last name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput<CompanyFormData>
                label="Email"
                name="primaryContactPerson.email"
                type="email"
                register={register}
                error={errors.primaryContactPerson?.email}
                placeholder="contact@example.com"
              />
              <FormInput<CompanyFormData>
                label="Phone"
                name="primaryContactPerson.phone"
                register={register}
                error={errors.primaryContactPerson?.phone}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen py-6 text-white p-4 bg-gradient-to-br from-black via-[#060C21] to-black animate-gradient-x">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto space-y-8 p-8">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`py-2 px-4 rounded-lg transition-colors ${
                activeSection === section
                  ? "bg-blue-600 text-white"
                  : hasErrorsInSection(section)
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-800">
          {renderSection()}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={goToPrevSection}
              className={`py-2 px-6 rounded-lg ${
                activeSection === sections[0] ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={activeSection === sections[0]}
            >
              Previous
            </button>

            {activeSection === sections[sections.length - 1] ? (
              <button type="submit" className="py-2 px-6 rounded-lg bg-green-600 hover:bg-green-700">
                {loading ? "Loading..." : "Submit"}
              </button>
            ) : (
              <button type="button" onClick={goToNextSection} className="py-2 px-6 rounded-lg bg-blue-600 hover:bg-blue-700">
                Next
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

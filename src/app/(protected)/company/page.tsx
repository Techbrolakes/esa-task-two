"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import mutations from "@/lib/mutations";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import LogoUploader from "@/components/LogoUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyFormData, companySchema } from "@/components/validations";
import { Company } from "@/types";
import { getItem, setItem } from "@/utils/storage";
import queries from "@/lib/queries";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Users,
  MapPin,
  UserCircle,
  Mail,
  Phone,
  Home,
  MapPinIcon,
  Globe,
  Hash,
  Facebook,
  Linkedin,
  SendHorizonal,
} from "lucide-react";
import FancyInput from "@/components/form/FancyInput";

const sections = ["company", "employees", "address", "contact"] as const;

const sectionIcons = {
  company: <Building2 size={18} />,
  employees: <Users size={18} />,
  address: <MapPin size={18} />,
  contact: <UserCircle size={18} />,
};

function CompanyPage() {
  const searchParams = useSearchParams();
  const [initialLogoKey, setInitialLogoKey] = useState<string | null>(null);
  const companyId = searchParams.get("companyId");
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

  const { loading: fetchingCompany } = useQuery(queries.GET_COMPANY, {
    variables: { getCompanyId: companyId },
    skip: !companyId,
    onCompleted: (data) => {
      if (data?.getCompany) {
        setInitialLogoKey(data.getCompany.logoS3Key || null);
        reset({
          legalName: data.getCompany.legalName,
          email: data.getCompany.email,
          phone: data.getCompany.phone,
          fax: data.getCompany.fax || "",
          website: data.getCompany.website || "",
          industry: data.getCompany.industry,
          stateOfIncorporation: data.getCompany.stateOfIncorporation,
          numberOfFullTimeEmployees: data.getCompany.numberOfFullTimeEmployees,
          numberOfPartTimeEmployees: data.getCompany.numberOfPartTimeEmployees,
          totalNumberOfEmployees: data.getCompany.totalNumberOfEmployees,
          facebookCompanyPage: data.getCompany.facebookCompanyPage || "",
          linkedInCompanyPage: data.getCompany.linkedInCompanyPage || "",
          logoS3Key: data.getCompany.logoS3Key || "",
          otherInformation: data.getCompany.otherInformation || "",
          isMailingAddressDifferentFromRegisteredAddress: data.getCompany.isMailingAddressDifferentFromRegisteredAddress,
          registeredAddress: data.getCompany.registeredAddress,
          mailingAddress: data.getCompany.mailingAddress || {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
          },
          primaryContactPerson: data.getCompany.primaryContactPerson,
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to fetch company details");
      router.push("/companies");
    },
  });

  const [createCompany, { loading: creating }] = useMutation(mutations.CREATE_COMPANY, {
    onCompleted: (data) => {
      if (data?.createCompany?.company) {
        const existingCompanies = getItem<Company[]>("companies").data || [];
        const updatedCompanies = [...existingCompanies, data.createCompany.company];
        const result = setItem("companies", updatedCompanies);

        if (result.error) {
          toast.error("Company created but failed to save locally");
          return;
        }

        toast.success("Company created successfully!");
        router.push("/companies");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create company");
    },
  });

  const [updateCompany, { loading: updating }] = useMutation(mutations.UPDATE_COMPANY, {
    onCompleted: (data) => {
      if (data?.updateCompany?.company) {
        const existingCompanies = getItem<Company[]>("companies").data || [];
        const updatedCompanies = existingCompanies.map((company) =>
          company.id === data.updateCompany.company.id ? data.updateCompany.company : company
        );

        const result = setItem("companies", updatedCompanies);
        if (result.error) {
          toast.error("Company updated but failed to save locally");
          return;
        }

        toast.success("Company updated successfully!");
        router.push(`/companies?companyId=${data.updateCompany.company.id}`);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update company");
    },
  });

  useEffect(() => {
    const fullTime = Number(watch("numberOfFullTimeEmployees")) || 0;
    const partTime = Number(watch("numberOfPartTimeEmployees")) || 0;
    setValue("totalNumberOfEmployees", fullTime + partTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("numberOfFullTimeEmployees"), watch("numberOfPartTimeEmployees"), setValue]);

  const getCurrentSectionFields = () => {
    switch (activeSection) {
      case "company":
        return [
          "logoS3Key",
          "legalName",
          "email",
          "phone",
          "industry",
          "stateOfIncorporation",
          "website",
          "fax",
          "facebookCompanyPage",
          "linkedInCompanyPage",
        ] as const;
      case "employees":
        return ["numberOfFullTimeEmployees", "numberOfPartTimeEmployees", "totalNumberOfEmployees"] as const;
      case "address":
        return [
          "registeredAddress.street",
          "registeredAddress.city",
          "registeredAddress.state",
          "registeredAddress.country",
          "registeredAddress.zipCode",
          "mailingAddress.street",
          "mailingAddress.city",
          "mailingAddress.state",
          "mailingAddress.country",
          "mailingAddress.zipCode",
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

  const goToNextSection = async () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      const fieldsToValidate = getCurrentSectionFields();
      const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
      if (isValid) setActiveSection(sections[currentIndex + 1]);
    }
  };

  const goToPrevSection = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1]);
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    const input = {
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
    };

    try {
      if (companyId) {
        await updateCompany({
          variables: {
            companyId,
            input,
          },
        });
      } else {
        await createCompany({
          variables: { input },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (fetchingCompany) {
    return (
      <div className="min-h-screen py-6 text-white p-4 bg-gradient-to-br from-gray-900 via-[#060C21] to-gray-900">
        <div className="max-w-4xl mx-auto p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800/50 rounded-lg w-1/4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-800/50 rounded-lg"></div>
              ))}
            </div>
            <div className="p-6 bg-gray-800/40 rounded-lg border border-gray-700 space-y-4">
              <div className="h-4 bg-gray-800/50 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gray-800/50 rounded-lg w-2/3"></div>
              <div className="h-4 bg-gray-800/50 rounded-lg w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "company":
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
              <FancyInput<CompanyFormData>
                label="Phone"
                type="number"
                name="phone"
                register={register}
                error={errors.phone}
                placeholder="+1 (555) 000-0000"
                required
                startIcon={<Phone className="w-4 h-4" />}
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
                startIcon={<Facebook className="w-4 h-4" />}
              />
              <FancyInput<CompanyFormData>
                label="LinkedIn Page"
                name="linkedInCompanyPage"
                register={register}
                error={errors.linkedInCompanyPage}
                placeholder="LinkedIn URL"
                startIcon={<Linkedin className="w-4 h-4" />}
              />
            </div>
          </div>
        );

      case "employees":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FancyInput<CompanyFormData>
                label="Full-Time Employees"
                name="numberOfFullTimeEmployees"
                type="number"
                register={register}
                error={errors.numberOfFullTimeEmployees}
                placeholder="Enter number"
                required
                startIcon={<Users className="w-4 h-4" />}
              />
              <FancyInput<CompanyFormData>
                label="Part-Time Employees"
                name="numberOfPartTimeEmployees"
                type="number"
                register={register}
                error={errors.numberOfPartTimeEmployees}
                placeholder="Enter number"
                required
                startIcon={<Users className="w-4 h-4" />}
              />
            </div>

            <FancyInput<CompanyFormData>
              label="Total Employees"
              name="totalNumberOfEmployees"
              type="number"
              register={register}
              error={errors.totalNumberOfEmployees}
              placeholder="Total will be calculated"
              disabled
              startIcon={<Users className="w-4 h-4" />}
            />

            <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-2">Additional Information</label>
              <textarea
                {...register("otherInformation")}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                rows={4}
                placeholder="Enter any additional information about the company"
              />
            </div>
          </div>
        );

      case "address":
        return (
          <div className="space-y-8">
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

      case "contact":
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
    }
  };

  return (
    <div className="min-h-screen py-6 text-white bg-gradient-to-br from-gray-900 via-[#060C21] to-gray-900">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {companyId ? "Update Company" : "Create Company"}
          </h1>
          <Link
            href="/companies"
            className="bg-gray-800/40 hover:bg-gray-700/40 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Companies
          </Link>
        </div>

        {/* Section Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2
                ${
                  activeSection === section
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : hasErrorsInSection(section)
                    ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                    : "bg-gray-800/40 hover:bg-gray-700/40 text-gray-300 hover:text-white border border-gray-700"
                }`}
            >
              {sectionIcons[section]}
              <span className="font-medium capitalize">{section}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 rounded-xl p-6 border border-gray-800/50">
          <div className="space-y-6">{renderSection()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-800/50">
            <button
              type="button"
              onClick={goToPrevSection}
              className={`flex items-center gap-2 transition-all duration-200
                ${
                  activeSection === sections[0]
                    ? "bg-gray-800/40 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                } px-6 py-2.5 rounded-lg font-medium`}
              disabled={activeSection === sections[0]}
            >
              <ArrowLeft size={18} />
              Previous
            </button>

            {activeSection === sections[sections.length - 1] ? (
              <button
                type="submit"
                disabled={creating || updating}
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-6 py-2.5 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
              >
                {creating || updating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {companyId ? "Update" : "Submit"}
                    <SendHorizonal size={18} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={goToNextSection}
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-6 py-2.5 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
              >
                Next
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default CompanyPage;

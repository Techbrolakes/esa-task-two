"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import mutations from "@/lib/mutations";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyFormData, companySchema } from "@/components/validations";
import { Company } from "@/types";
import { getItem, removeItem, setItem } from "@/utils/storage";
import queries from "@/lib/queries";
import { ArrowLeft, ArrowRight, Building2, Users, MapPin, UserCircle, SendHorizonal } from "lucide-react";
import CompanySection from "@/components/form-steps/CompanySection";
import EmployeeSection from "@/components/form-steps/EmployeeSection";
import AddressSection from "@/components/form-steps/AddressSection";
import ContactSection from "@/components/form-steps/ContactSection";
import ExitDialog from "@/components/ui/ExitDialog";
import { Skeleton } from "@/components/Skeleton";

const sections = ["company", "employees", "address", "contact"] as const;

const FORM_STORAGE_KEY = "companyFormData";

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
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty: formIsDirty },
    watch,
    reset,
    trigger,
    setValue,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    mode: "onChange",
    criteriaMode: "all",
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

  useEffect(() => {
    if (!companyId) {
      const savedData = getItem(FORM_STORAGE_KEY).data;
      if (savedData) {
        reset(savedData);
        setIsDirty(true);
      }
    }
  }, [companyId, reset]);

  const formData = watch();

  useEffect(() => {
    if (!companyId && formIsDirty) {
      setItem(FORM_STORAGE_KEY, formData);
      setIsDirty(true);
    }
  }, [formData, companyId, formIsDirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent): string | undefined => {
      if (isDirty) {
        e.preventDefault();
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const clearSavedFormData = () => {
    removeItem(FORM_STORAGE_KEY);
    setIsDirty(false);
  };

  const handleNavigateBack = () => {
    if (isDirty) {
      setShowExitDialog(true);
    } else {
      router.push("/companies");
    }
  };

  const confirmExit = () => {
    clearSavedFormData();
    router.push("/companies");
  };

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

        clearSavedFormData();
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

        clearSavedFormData();

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
        return ["numberOfFullTimeEmployees", "numberOfPartTimeEmployees", "totalNumberOfEmployees", "otherInformation"] as const;
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
          errors.numberOfFullTimeEmployees?.message ||
          errors.numberOfPartTimeEmployees?.message ||
          errors.totalNumberOfEmployees?.message ||
          errors.otherInformation?.message
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

      // Validate the fields
      const isValid = await trigger(fieldsToValidate, {
        shouldFocus: true,
      });

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
    return <Skeleton />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "company":
        return (
          <CompanySection register={register} errors={errors} watch={watch} setValue={setValue} initialLogoKey={initialLogoKey} />
        );

      case "employees":
        return <EmployeeSection register={register} errors={errors} watch={watch} setValue={setValue} />;

      case "address":
        return <AddressSection register={register} errors={errors} watch={watch} />;

      case "contact":
        return <ContactSection register={register} errors={errors} />;
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
          <button
            type="button"
            disabled={creating || updating}
            onClick={handleNavigateBack}
            className="bg-gray-800/40 hover:bg-gray-700/40 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Companies
          </button>
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
            {activeSection === "contact" ? (
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }}
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
                onClick={(e) => {
                  e.preventDefault();
                  goToNextSection();
                }}
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-6 py-2.5 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
              >
                Next
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </form>

      <ExitDialog isOpen={showExitDialog} onClose={() => setShowExitDialog(false)} onConfirm={confirmExit} />
    </div>
  );
}

export default CompanyPage;

// Custom Alert Dialog Component

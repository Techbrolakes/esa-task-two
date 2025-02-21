import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(1, "Zip code is required"),
});

export const primaryContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

export const employeesSchema = z.object({
  numberOfFullTimeEmployees: z.string().min(1, "Invalid number of employees"),
  numberOfPartTimeEmployees: z.string().min(1, "Invalid number of employees"),
  totalNumberOfEmployees: z.string().min(1, "Invalid number of employees"),
  otherInformation: z.string().optional(),
});

export const companySchema = z.object({
  legalName: z
    .string()
    .min(1, "Legal name is required")
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, "Legal name cannot be empty or contain only spaces"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  fax: z.string().optional(),
  website: z.string().url("Invalid website URL"),
  industry: z.string().min(1, "Industry is required"),
  stateOfIncorporation: z.string().min(1, "State of incorporation is required"),
  facebookCompanyPage: z.string().url("Invalid Facebook URL").optional(),
  linkedInCompanyPage: z.string().url("Invalid LinkedIn URL").optional(),
  logoS3Key: z.string().min(1, "Company logo is required"),
  isMailingAddressDifferentFromRegisteredAddress: z.coerce.boolean(),
  employees: employeesSchema,
  registeredAddress: addressSchema,
  mailingAddress: addressSchema,
  primaryContactPerson: primaryContactSchema,
});

export type CompanyFormData = z.infer<typeof companySchema>;

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

export const companySchema = z.object({
  legalName: z.string().min(1, "Legal name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  fax: z.string().optional(),
  website: z.string().url("Invalid website URL").optional(),
  industry: z.string().min(1, "Industry is required"),
  stateOfIncorporation: z.string().min(1, "State of incorporation is required"),
  numberOfFullTimeEmployees: z.coerce.number().min(0, "Invalid number of employees"),
  numberOfPartTimeEmployees: z.coerce.number().min(0, "Invalid number of employees"),
  totalNumberOfEmployees: z.coerce.number().min(0, "Invalid number of employees"),
  facebookCompanyPage: z.string().url("Invalid Facebook URL").optional(),
  linkedInCompanyPage: z.string().url("Invalid LinkedIn URL").optional(),
  logoS3Key: z.string().min(1, "Company logo is required"),
  otherInformation: z.string().optional(),
  isMailingAddressDifferentFromRegisteredAddress: z.coerce.boolean(),
  registeredAddress: addressSchema,
  mailingAddress: addressSchema,
  primaryContactPerson: primaryContactSchema,
});

export type CompanyFormData = z.infer<typeof companySchema>;

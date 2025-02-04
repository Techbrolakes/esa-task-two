type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isMailingAddressDifferentFromRegisteredAddress?: boolean;
};

type ContactPerson = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export interface Company {
  id: string;
  legalName: string;
  email: string;
  phone: string;
  fax?: string | null;
  website?: string | null;
  industry: string;
  stateOfIncorporation: string;
  numberOfFullTimeEmployees: number;
  numberOfPartTimeEmployees: number;
  totalNumberOfEmployees: number;
  facebookCompanyPage?: string | null;
  linkedInCompanyPage?: string | null;
  logoS3Key?: string | null;
  otherInformation?: string | null;
  isMailingAddressDifferentFromRegisteredAddress: boolean;
  registeredAddress: Address;
  mailingAddress: Address;
  primaryContactPerson: ContactPerson;
}

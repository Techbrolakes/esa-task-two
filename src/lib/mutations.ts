import { gql } from "@apollo/client";

const COMPANY_FIELDS = gql`
  fragment CompanyFields on Company {
    id
    legalName
    stateOfIncorporation
    industry
    totalNumberOfEmployees
    numberOfFullTimeEmployees
    numberOfPartTimeEmployees
    website
    linkedInCompanyPage
    facebookCompanyPage
    otherInformation
    primaryContactPerson {
      firstName
      lastName
      email
      phone
    }
    logoS3Key
    phone
    fax
    email
    registeredAddress {
      isMailingAddressDifferentFromRegisteredAddress
      country
      state
      city
      street
      zipCode
    }
    mailingAddress {
      isMailingAddressDifferentFromRegisteredAddress
      country
      state
      city
      street
      zipCode
    }
  }
`;

const UPDATE_COMPANY = gql`
  mutation UpdateCompany($companyId: ID!, $input: UpdateCompanyInput!) {
    updateCompany(companyId: $companyId, input: $input) {
      company {
        ...CompanyFields
      }
    }
  }
  ${COMPANY_FIELDS}
`;

const CREATE_COMPANY = gql`
  mutation CreateCompany($input: UpdateCompanyInput!) {
    createCompany(input: $input) {
      company {
        ...CompanyFields
      }
    }
  }
  ${COMPANY_FIELDS}
`;

const mutations = {
  UPDATE_COMPANY,
  CREATE_COMPANY,
};

export default mutations;

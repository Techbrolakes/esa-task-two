import { gql } from "@apollo/client";

const UPDATE_COMPANY = gql`
  mutation UpdateCompany($companyId: ID!, $input: UpdateCompanyInput!) {
    updateCompany(companyId: $companyId, input: $input) {
      company {
        email,
        id,
      }
    }
  }
`;

const CREATE_COMPANY = gql`
  mutation CreateCompany($input: UpdateCompanyInput!) {
    createCompany(input: $input) {
      company {
        email,
        id,
      }
    }
  }
`;

const mutations = {
  UPDATE_COMPANY,
  CREATE_COMPANY,
};

export default mutations;

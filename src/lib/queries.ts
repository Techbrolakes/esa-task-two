import { gql } from "@apollo/client";

const GET_SIGNED_UPLOAD_URL = gql`
  query GetSignedUploadUrl($input: SignedFileUploadInput) {
    getSignedUploadUrl(input: $input) {
      url
      key
    }
  }
`;

const GET_SIGNED_DOWNLOAD_URL = gql`
  query GetSignedDownloadUrl($s3Key: String) {
    getSignedDownloadUrl(s3Key: $s3Key) {
      url
      key
    }
  }
`;

const GET_COMPANY = gql`
  query GetCompany($getCompanyId: String) {
    getCompany(id: $getCompanyId) {
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
  }
`;

const queries = {
  GET_COMPANY,
  GET_SIGNED_DOWNLOAD_URL,
  GET_SIGNED_UPLOAD_URL,
};

export default queries;

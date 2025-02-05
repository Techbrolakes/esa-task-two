import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Company } from "@/types";
import CompanyCard from "@/components/reuseables/CompanyCard";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe("CompanyCard", () => {
  const mockCompany: Company = {
    id: "1",
    legalName: "Test Company",
    email: "test@company.com",
    industry: "Technology",
    phone: "+1234567890",
    website: "https://testcompany.com",
    totalNumberOfEmployees: 100,
    numberOfFullTimeEmployees: 75,
    numberOfPartTimeEmployees: 25,
    stateOfIncorporation: "Test State",
    primaryContactPerson: {
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      phone: "1234567890",
    },
    registeredAddress: {
      street: "Test Street",
      city: "Test City",
      state: "Test State",
      country: "Test Country",
      zipCode: "12345",
    },
    isMailingAddressDifferentFromRegisteredAddress: false,
    mailingAddress: {
      street: "Test Street",
      city: "Test City",
      state: "Test State",
      country: "Test Country",
      zipCode: "12345",
    },
    facebookCompanyPage: "https://facebook.com/testcompany",
    linkedInCompanyPage: "https://linkedin.com/company/testcompany",
    logoS3Key: null,
    fax: null,
    otherInformation: null,
  };

  it("renders basic company information correctly", () => {
    render(<CompanyCard company={mockCompany} />);

    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("test@company.com")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
  });

  it("renders contact person details", () => {
    render(<CompanyCard company={mockCompany} />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
  });

  it("renders location information", () => {
    render(<CompanyCard company={mockCompany} />);

    expect(screen.getByText("Test State")).toBeInTheDocument();
    expect(screen.getByText("Test Country")).toBeInTheDocument();
  });

  it("renders view details link", () => {
    render(<CompanyCard company={mockCompany} />);

    const link = screen.getByText("View Details");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/companies?companyId=1");
  });
});

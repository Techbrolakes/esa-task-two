import { describe, it, expect, vi } from "vitest";
import type { Control } from "react-hook-form";
import { CompanyFormData } from "@/lib/validations";
import CompanySection from "@/components/form-steps/CompanySection";
import { render, screen } from "@testing-library/react";
import { ApolloProvider } from "@apollo/client";
import { mockApolloClient } from "@/lib/test-utils"; // We'll create this

vi.mock("@/components/form/LogoUploader", () => ({
  default: ({ label }: { label: string }) => (
    <div data-testid="logo-uploader">
      <label>{label}</label>
    </div>
  ),
}));

vi.mock("@/components/form/PhoneInputField", () => ({
  default: ({ label }: { label: string }) => (
    <div data-testid="phone-input">
      <label>{label}</label>
    </div>
  ),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={mockApolloClient}>{children}</ApolloProvider>
);

describe("CompanySection", () => {
  const mockProps = {
    register: vi.fn(),
    errors: {},
    watch: vi.fn(),
    setValue: vi.fn(),
    initialLogoKey: null,
    control: {} as Control<CompanyFormData>,
  };

  const customRender = (ui: React.ReactElement) => {
    return render(ui, { wrapper: Wrapper });
  };

  it("renders basic form structure", () => {
    customRender(<CompanySection {...mockProps} />);

    expect(screen.getByTestId("logo-uploader")).toBeInTheDocument();
    expect(screen.getByLabelText(/legal name/i)).toBeInTheDocument();
    expect(screen.getByTestId("phone-input")).toBeInTheDocument();
  });

  it("displays error messages when provided", () => {
    const propsWithErrors = {
      ...mockProps,
      errors: {
        legalName: {
          type: "required",
          message: "Legal name is required",
        },
      },
    };

    customRender(<CompanySection {...propsWithErrors} />);
    expect(screen.getByText("Legal name is required")).toBeInTheDocument();
  });

  it("has the expected grid layout structure", () => {
    customRender(<CompanySection {...mockProps} />);

    // Check for grid containers
    const gridDivs = document.querySelectorAll(".grid.grid-cols-1.md\\:grid-cols-2");
    expect(gridDivs.length).toBeGreaterThan(0);
  });
});

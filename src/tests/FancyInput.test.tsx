import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Mail } from "lucide-react";
import FancyInput from "@/components/form/FancyInput";

describe("FancyInput", () => {
  const defaultProps = {
    register: vi.fn(),
    name: "testField" as const,
  };

  it("renders input field correctly", () => {
    render(<FancyInput {...defaultProps} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<FancyInput {...defaultProps} label="Email Address" />);
    expect(screen.getByText("Email Address")).toBeInTheDocument();
  });

  it("shows required indicator when field is required", () => {
    render(<FancyInput {...defaultProps} label="Email Address" required />);

    const requiredIndicator = screen.getByText("*");
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass("text-red-400");
  });

  it("shows error message when error is provided", () => {
    const error = {
      type: "required",
      message: "This field is required",
    };

    render(<FancyInput {...defaultProps} error={error} />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("renders start icon when provided", () => {
    render(<FancyInput {...defaultProps} startIcon={<Mail data-testid="mail-icon" />} />);

    expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
  });

  it("renders placeholder text when provided", () => {
    render(<FancyInput {...defaultProps} placeholder="Enter your email" />);

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  it("applies error styles to input when error is provided", () => {
    const error = {
      type: "required",
      message: "This field is required",
    };

    render(<FancyInput {...defaultProps} error={error} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-red-500/50");
    expect(input).toHaveClass("focus:ring-red-500/30");
  });

  it("shows helper text when provided and no error", () => {
    render(<FancyInput {...defaultProps} helperText="Must be a valid email address" />);

    expect(screen.getByText("Must be a valid email address")).toBeInTheDocument();
  });

  it("prioritizes error message over helper text", () => {
    const error = {
      type: "required",
      message: "This field is required",
    };

    render(<FancyInput {...defaultProps} error={error} helperText="Must be a valid email address" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.queryByText("Must be a valid email address")).not.toBeInTheDocument();
  });
});

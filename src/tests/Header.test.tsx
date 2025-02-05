import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import Header from "@/components/reuseables/Header";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: vi.fn(),
}));

vi.mock("@/utils/storage", () => ({
  removeItem: vi.fn(),
}));

vi.mock("cookies-next", () => ({
  deleteCookie: vi.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue("/companies");
  });

  it("renders header with title", () => {
    render(<Header />);
    expect(screen.getByText(/FE-2024-12-i - Companies App/i)).toBeInTheDocument();
  });

  it("shows Create Company button when not on company page", () => {
    vi.mocked(usePathname).mockReturnValue("/companies");
    render(<Header />);
    expect(screen.getByText("Create Company")).toBeInTheDocument();
  });

  it("hides Create Company button on company page", () => {
    vi.mocked(usePathname).mockReturnValue("/company");
    render(<Header />);
    expect(screen.queryByText("Create Company")).not.toBeInTheDocument();
  });
});

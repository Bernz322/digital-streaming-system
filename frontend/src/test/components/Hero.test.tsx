import { cleanup, render, screen } from "@testing-library/react";
import { Hero } from "../../components";

describe("Render all elements", () => {
  afterEach(cleanup);

  test("should render app name", () => {
    render(<Hero />);
    const appNameElement = screen.getByRole("heading", { level: 1 });

    expect(appNameElement).toBeInTheDocument();
  });

  test("should show all hero section elements", () => {
    render(<Hero />);

    const headingElement = screen.getByRole("heading", { level: 1 });
    const subHeadingElement = screen.getByRole("heading", { level: 5 });
    const pHeadingElement = screen.getByText(/Recognized?/i);
    const logoImgElement = screen.getByAltText("logo");

    expect(headingElement).toBeInTheDocument();
    expect(subHeadingElement).toBeInTheDocument();
    expect(pHeadingElement).toBeInTheDocument();
    expect(logoImgElement).toBeInTheDocument();
  });
});

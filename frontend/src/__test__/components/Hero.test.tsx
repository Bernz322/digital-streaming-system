/* eslint-disable testing-library/no-render-in-setup */
import { cleanup, render, screen } from "@testing-library/react";
import { Hero } from "../../components";

describe("<Hero/>", () => {
  beforeEach(() => render(<Hero />));
  afterEach(cleanup);

  test("should render app name", () => {
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  test("should show all hero section elements", () => {
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 5 })).toBeInTheDocument();
    expect(screen.getByText(/Recognized?/i)).toBeInTheDocument();
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });
});

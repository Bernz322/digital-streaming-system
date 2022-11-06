import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Home } from ".";
import { renderWithProviders } from "../utils/test-utils";

describe("Test Home Page", () => {
  test("should render hero section", () => {
    renderWithProviders(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const headingElement = screen.getAllByRole("heading", { level: 1 });
    const subHeadingElement = screen.getAllByRole("heading", { level: 5 });
    const pHeadingElement = screen.getByText(/Recognized?/i);
    const logoImgElement = screen.getByAltText("logo");

    expect(headingElement[0]).toBeInTheDocument();
    expect(subHeadingElement[0]).toBeInTheDocument();
    expect(pHeadingElement).toBeInTheDocument();
    expect(logoImgElement).toBeInTheDocument();
  });
  test("should render movies library container", () => {
    renderWithProviders(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const headingElement = screen.getAllByRole("heading", { level: 1 });
    const seeAllElement = screen.getByRole("heading", { level: 2 });

    expect(headingElement[0]).toBeInTheDocument();
    expect(seeAllElement).toBeInTheDocument();
  });
  test("should navigate me to '/movies' route when 'Movies Library' is clicked", () => {
    renderWithProviders(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const element = screen.getByText("Movies Library");
    userEvent.click(element);
    expect(window.location.pathname).toEqual("/movies");
  });
  test("should navigate me to '/movies' route when 'SEE ALL' is clicked", () => {
    renderWithProviders(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const element = screen.getByText(/see all/i);
    userEvent.click(element);
    expect(window.location.pathname).toEqual("/movies");
  });
});

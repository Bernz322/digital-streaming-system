/* eslint-disable testing-library/no-render-in-setup */
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Home } from "../../pages";
import { renderWithProviders } from "../../utils/test-utils";

describe("<Home />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };
  afterEach(cleanup);

  test("should render hero section elements", () => {
    renderApp();
    const headingElement = screen.getByRole("heading", { name: /ratebox/i });
    const subHeadingElement = screen.getByRole("heading", { name: /HOME/i });
    const pHeadingElement = screen.getByText(/Recognized/i);
    const logoImgElement = screen.getByAltText("logo");

    expect(headingElement).toBeInTheDocument(); // ratebox
    expect(subHeadingElement).toBeInTheDocument(); // THE HOME ...
    expect(pHeadingElement).toBeInTheDocument(); // Recognized
    expect(logoImgElement).toBeInTheDocument(); // Logo Image
  });

  test("should render movies library container", () => {
    renderApp();
    const libraryElement = screen.getByRole("link", { name: "Movies Library" });
    const seeAllElement = screen.getByRole("link", { name: "See all" });

    expect(libraryElement).toBeInTheDocument();
    expect(seeAllElement).toBeInTheDocument();
  });

  test("should navigate to '/movies' route when 'Movies Library' is clicked", () => {
    const history = createMemoryHistory();
    renderWithProviders(
      <Router location={history.location} navigator={history}>
        <Home />
      </Router>
    );
    const libraryElement = screen.getByRole("link", { name: "Movies Library" });
    userEvent.click(libraryElement);
    expect(history.location.pathname).toEqual("/movies");
  });

  test("should navigate to '/movies' route when 'SEE ALL' is clicked", () => {
    const history = createMemoryHistory();
    renderWithProviders(
      <Router location={history.location} navigator={history}>
        <Home />
      </Router>
    );
    const seeAllElement = screen.getByRole("link", { name: "See all" });
    userEvent.click(seeAllElement);
    expect(history.location.pathname).toEqual("/movies");
  });
});

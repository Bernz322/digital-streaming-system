/* eslint-disable testing-library/no-render-in-setup */
import { cleanup, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../utils/test-utils";
import App from "../App";
import { mockUsers } from "../utils/db.mocks";

describe("<App />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  };
  afterEach(() => cleanup);

  describe("Public Routes and Nav Items", () => {
    beforeEach(() => renderApp());
    test("should render home page", () => {
      const moviesSectionHead = screen.getByRole("heading", {
        name: "Movies Library",
      });
      expect(moviesSectionHead).toBeInTheDocument();
    });

    test("should render movies page when navigated", () => {
      const moviesNavItem = screen.getByRole("heading", { name: "Movies" });
      expect(moviesNavItem).toBeInTheDocument();

      userEvent.click(moviesNavItem);
      expect(
        screen.getByRole("heading", { level: 1, name: "Movies" })
      ).toBeInTheDocument();
    });

    test("should render actors page when navigated", () => {
      const actorsNavItem = screen.getByRole("heading", { name: "Actors" });
      expect(actorsNavItem).toBeInTheDocument();

      userEvent.click(actorsNavItem);
      expect(
        screen.getByRole("heading", { level: 1, name: "Actors" })
      ).toBeInTheDocument();
    });
  });

  test("should render dashboard page when navigated", () => {
    renderWithProviders(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            loggedIn: true,
            user: mockUsers[0], // admin role
            isLoading: false,
          },
        },
      }
    );

    const dashboardNavItem = screen.getByRole("heading", { name: "Dashboard" });
    expect(dashboardNavItem).toBeInTheDocument();

    userEvent.click(dashboardNavItem);
    expect(
      screen.getByRole("button", { name: "Add User" })
    ).toBeInTheDocument();
  });
});

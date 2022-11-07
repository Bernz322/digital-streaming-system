import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "../../components";
import { renderWithProviders } from "../../utils/test-utils";

describe("Test Navbar Component", () => {
  afterEach(cleanup);

  test("should render app name", () => {
    renderWithProviders(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const logoNameElement = screen.getByRole("heading", { level: 1 });
    expect(logoNameElement).toBeInTheDocument();
  });

  test("should render user only nav items", () => {
    renderWithProviders(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const homeNavItemElement = screen.getByText(/home/i);
    const moviesNavItemElement = screen.getByText(/movies/i);
    const actorsNavItemElement = screen.getByText(/actors/i);

    expect(homeNavItemElement).toBeInTheDocument();
    expect(moviesNavItemElement).toBeInTheDocument();
    expect(actorsNavItemElement).toBeInTheDocument();
  });

  test("should render dashboard nav item and logout button", () => {
    renderWithProviders(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            loggedIn: true,
            user: {
              id: "6365cbc3e303fc6228363b9d",
              name: "admin root",
              email: "admin@root.com",
              role: "admin",
              isActivated: true,
            },
            isLoading: false,
          },
        },
      }
    );

    const dashboardNavItemElement = screen.getByText(/dashboard/i);
    const logoutBtnElement = screen.getByText(/logout/i);

    expect(dashboardNavItemElement).toBeInTheDocument();
    expect(logoutBtnElement).toBeInTheDocument();
  });

  test("should hide dashboard nav item and render login button after clicking logout", async () => {
    renderWithProviders(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            loggedIn: true,
            user: {
              id: "6365cbc3e303fc6228363b9d",
              name: "admin root",
              email: "admin@root.com",
              role: "admin",
              isActivated: true,
            },
            isLoading: false,
          },
        },
      }
    );

    const dashboardNavItemElement = screen.getByText(/dashboard/i);
    const logoutBtnElement = screen.getByText(/logout/i);

    userEvent.click(logoutBtnElement);

    expect(dashboardNavItemElement).not.toBeInTheDocument();
    expect(logoutBtnElement.textContent).toEqual("Login");
  });
});

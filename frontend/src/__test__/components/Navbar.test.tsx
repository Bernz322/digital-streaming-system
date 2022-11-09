import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "../../components";
import { mockUsers } from "../../utils/db.mocks";
import { renderWithProviders } from "../../utils/test-utils";

describe("<Navbar />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };
  afterEach(cleanup);

  test("should render app name", () => {
    renderApp();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument(); // ratebox
  });

  test("should render default nav items", () => {
    renderApp();
    expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Movies" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Actors" })).toBeInTheDocument();
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
            user: mockUsers[0], // admin role
            isLoading: false,
          },
        },
      }
    );
    expect(
      screen.getByRole("heading", {
        name: "Dashboard",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Logout" })).toBeInTheDocument();
  });

  test("should hide dashboard nav link and render login button after logout", async () => {
    renderWithProviders(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            loggedIn: true,
            user: mockUsers[0], // admin role,
            isLoading: false,
          },
        },
      }
    );
    const dashboardNavElement = screen.getByRole("heading", {
      name: "Dashboard",
    });
    const logoutBtnElement = screen.getByRole("link", { name: "Logout" });

    userEvent.click(logoutBtnElement);

    expect(dashboardNavElement).not.toBeInTheDocument();
    expect(logoutBtnElement.textContent).toEqual("Login");
  });

  test("should not render dashboard nav link if user is not admin", async () => {
    renderWithProviders(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            loggedIn: true,
            user: mockUsers[1], // user role,
            isLoading: false,
          },
        },
      }
    );
    const navLinkElements = screen.getAllByRole("heading", { level: 3 });
    // Default nav items only render 3 items
    expect(navLinkElements.length).toBe(3);
  });
});

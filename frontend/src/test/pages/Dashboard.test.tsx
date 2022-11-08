/* eslint-disable testing-library/no-render-in-setup */
import { cleanup, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../utils/test-utils";
import { Dashboard } from "../../pages";

describe("<Dashboard />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };
  beforeEach(() => renderApp());
  afterEach(cleanup);

  test("should render sidebar elements", () => {
    const dashboardLinkElement = screen.getByRole("link", {
      name: "Dashboard",
    });
    const usersLinkElement = screen.getByRole("link", {
      name: "Users",
    });
    const actorsLinkElement = screen.getByRole("link", {
      name: "Actors",
    });
    const moviesLinkElement = screen.getByRole("link", {
      name: "Movies",
    });

    expect(dashboardLinkElement).toBeInTheDocument();
    expect(usersLinkElement).toBeInTheDocument();
    expect(actorsLinkElement).toBeInTheDocument();
    expect(moviesLinkElement).toBeInTheDocument();
  });

  test("should render all 4 tables", () => {
    const usersTableElement = screen.getByText("Users List");
    const actorsTableElement = screen.getByText("Actors List");
    const moviesTableElement = screen.getByText("Movies List");
    const reviewsTableElement = screen.getByText("Your selected movie reviews");

    expect(usersTableElement).toBeInTheDocument();
    expect(actorsTableElement).toBeInTheDocument();
    expect(moviesTableElement).toBeInTheDocument();
    expect(reviewsTableElement).toBeInTheDocument();
  });

  test("should render all tables on dashboard link click", () => {
    const dashboardLinkElement = screen.getByRole("link", {
      name: "Dashboard",
    });
    const usersTableElement = screen.getByText("Users List");
    const actorsTableElement = screen.getByText("Actors List");
    const moviesTableElement = screen.getByText("Movies List");
    const reviewsTableElement = screen.getByText("Your selected movie reviews");

    userEvent.click(dashboardLinkElement);

    expect(usersTableElement).toBeInTheDocument();
    expect(actorsTableElement).toBeInTheDocument();
    expect(moviesTableElement).toBeInTheDocument();
    expect(reviewsTableElement).toBeInTheDocument();
  });

  test("should render users table only on users link click", () => {
    const usersLinkElement = screen.getByRole("link", {
      name: "Users",
    });
    const usersTableElement = screen.getByText("Users List");

    userEvent.click(usersLinkElement);

    expect(usersTableElement).toBeInTheDocument();
  });

  test("should render actors table only on actors link click", () => {
    const actorsLinkElement = screen.getByRole("link", {
      name: "Actors",
    });
    const actorsTableElement = screen.getByText("Actors List");

    userEvent.click(actorsLinkElement);

    expect(actorsTableElement).toBeInTheDocument();
  });

  test("should render movies and reviews table on movies link click", () => {
    const moviesLinkElement = screen.getByRole("link", {
      name: "Movies",
    });
    const moviesTableElement = screen.getByText("Movies List");
    const reviewsTableElement = screen.getByText("Your selected movie reviews");

    userEvent.click(moviesLinkElement);

    expect(moviesTableElement).toBeInTheDocument();
    expect(reviewsTableElement).toBeInTheDocument();
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import renderWithProviders from "../../utils/test-utils";
import { Dashboard } from "../../pages";

describe("<Dashboard />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };
  afterEach(cleanup);

  test("should render sidebar elements", () => {
    renderApp();
    const usersLinkElement = screen.getByRole("link", {
      name: "Users",
    });
    const actorsLinkElement = screen.getByRole("link", {
      name: "Actors",
    });
    const moviesLinkElement = screen.getByRole("link", {
      name: "Movies",
    });

    expect(usersLinkElement).toBeInTheDocument();
    expect(actorsLinkElement).toBeInTheDocument();
    expect(moviesLinkElement).toBeInTheDocument();
  });

  test("should render users table first", () => {
    renderApp();
    const usersTableElement = screen.getByText("Users List");

    expect(usersTableElement).toBeInTheDocument();
  });

  test("should navigate to 'cm/users' on users link click", () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Dashboard />
      </Router>
    );
    const usersLinkElement = screen.getByRole("link", {
      name: "Users",
    });
    userEvent.click(usersLinkElement);

    expect(history.location.pathname).toEqual("/cm/users");
  });

  test("should navigate to 'cm/actors' on actors link click", () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Dashboard />
      </Router>
    );
    const actorsLinkElement = screen.getByRole("link", {
      name: "Actors",
    });

    userEvent.click(actorsLinkElement);
    expect(history.location.pathname).toEqual("/cm/actors");
  });

  test("should render movies and reviews table on movies link click", () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Dashboard />
      </Router>
    );
    const moviesLinkElement = screen.getByRole("link", {
      name: "Movies",
    });

    userEvent.click(moviesLinkElement);
    expect(history.location.pathname).toEqual("/cm/movies");
  });
});

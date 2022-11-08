/* eslint-disable testing-library/no-render-in-setup */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Page404 } from "../../pages";

describe("<Page404 />", () => {
  const renderApp = () => {
    return render(
      <BrowserRouter>
        <Page404 />
      </BrowserRouter>
    );
  };
  beforeEach(() => renderApp());
  afterEach(cleanup);

  test("should render the page with 404", () => {
    const element404 = screen.getByText("404");
    expect(element404.textContent).toEqual("404");
    expect(element404).toBeInTheDocument();
  });

  test("should render child descriptions", () => {
    const elementHead = screen.getByRole("heading", { level: 1 });
    const elementChild = screen.getByText(/Unfortunately/i);
    expect(elementHead).toBeInTheDocument();
    expect(elementChild).toBeInTheDocument();
  });

  test("should render button", () => {
    const btnElement = screen.getByRole("button");
    expect(btnElement).toBeInTheDocument();
  });

  test("should navigate to '/' route when button is clicked", () => {
    const btnElement = screen.getByRole("button");
    userEvent.click(btnElement);
    expect(window.location.pathname).toEqual("/");
  });
});

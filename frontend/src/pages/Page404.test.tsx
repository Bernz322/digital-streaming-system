import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Page404 } from ".";

describe("Test 404 Page", () => {
  test("should render the page with 404", () => {
    render(
      <BrowserRouter>
        <Page404 />
      </BrowserRouter>
    );

    const element404 = screen.getByText("404");
    expect(element404.textContent).toEqual("404");
    expect(element404).toBeInTheDocument();
  });

  test("should child descriptions", () => {
    render(
      <BrowserRouter>
        <Page404 />
      </BrowserRouter>
    );

    const elementHead = screen.getByRole("heading", { level: 1 });
    const elementChild = screen.getByText(/you may have mistyped/i);
    expect(elementHead).toBeInTheDocument();
    expect(elementChild).toBeInTheDocument();
  });

  test("should render to home page button", () => {
    render(
      <BrowserRouter>
        <Page404 />
      </BrowserRouter>
    );

    const btnElement = screen.getByRole("button");
    expect(btnElement).toBeInTheDocument();
  });

  test("should return me to '/' route when button is clicked", () => {
    render(
      <BrowserRouter>
        <Page404 />
      </BrowserRouter>
    );

    const btnElement = screen.getByRole("button");
    userEvent.click(btnElement);
    expect(window.location.pathname).toEqual("/");
  });
});

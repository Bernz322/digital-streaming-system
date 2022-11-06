import {
  cleanup,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Actors } from ".";
import { renderWithProviders } from "../utils/test-utils";
import { mockActors } from "../utils/db.mocks";
import { IActor } from "../utils/types";
import { server } from "../mocks/server";

// Enable API mocking before tests.
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe("Test All Actors Page", () => {
  afterEach(cleanup);

  test("should render actor search input", () => {
    renderWithProviders(
      <BrowserRouter>
        <Actors />
      </BrowserRouter>
    );

    const searchInputElement = screen.getByRole("textbox");
    expect(searchInputElement).toBeInTheDocument();
  });

  test("should render actor search button", () => {
    renderWithProviders(
      <BrowserRouter>
        <Actors />
      </BrowserRouter>
    );

    const searchBtnElement = screen.getByRole("button");
    expect(searchBtnElement).toBeInTheDocument();
  });

  test("should render all mock actors", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <Actors />
      </BrowserRouter>
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    expect(screen.getAllByRole("img", { name: "actor" }).length).toBe(
      mockActors.length
    );
    expect(store.getState().actor.actors.length).toEqual(mockActors.length);
  });

  test('should not render "There are no actors available" h1 tag', async () => {
    renderWithProviders(
      <BrowserRouter>
        <Actors />
      </BrowserRouter>
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const noMovieElement = screen.getAllByRole("heading", { level: 1 });
    expect(noMovieElement.length).toEqual(1);
  });

  test('should render "There are no actors available" h1 tag', async () => {
    renderWithProviders(
      <BrowserRouter>
        <Actors />
      </BrowserRouter>,
      {
        preloadedState: {
          actor: {
            isLoading: false,
            actors: [],
            selectedActor: {} as IActor,
          },
        },
      }
    );
    const noMovieElement = screen.getAllByRole("heading", { level: 1 });
    expect(noMovieElement[1]).toBeInTheDocument();
  });

  test("should be able to type a text", () => {
    renderWithProviders(
      <BrowserRouter>
        <Actors />
      </BrowserRouter>
    );
    const toSearchValue = "Keanu";
    const searchInputElement: HTMLInputElement = screen.getByRole("textbox");
    userEvent.type(searchInputElement, toSearchValue);
    expect(searchInputElement.value).toBe(toSearchValue);
  });

  test("should show empty field error message", () => {
    renderWithProviders(
      <BrowserRouter>
        <Actors />
      </BrowserRouter>
    );

    const searchInputElement: HTMLInputElement = screen.getByRole("textbox");
    const searchBtnElement = screen.getByRole("button");
    userEvent.type(searchInputElement, " ");
    userEvent.click(searchBtnElement);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  test("should show searched actors card", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <Actors />
      </BrowserRouter>
    );

    const searchInputElement: HTMLInputElement = screen.getByRole("textbox");
    const searchBtnElement = screen.getByRole("button");
    userEvent.type(searchInputElement, "keanu");
    userEvent.click(searchBtnElement);

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    expect(screen.getAllByRole("img", { name: "actor" }).length).toBe(1);
    expect(store.getState().actor.actors.length).toEqual(1);
  });
});

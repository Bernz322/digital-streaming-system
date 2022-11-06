import {
  cleanup,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Movies } from ".";
import { renderWithProviders } from "../utils/test-utils";
import { mockMovies } from "../utils/db.mocks";
import { IMovie } from "../utils/types";
import { server } from "../mocks/server";

// Enable API mocking before tests.
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe("Test All Movies Page", () => {
  afterEach(cleanup);
  test("should render movie search input", () => {
    renderWithProviders(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );

    const searchInputElement = screen.getByRole("textbox");
    expect(searchInputElement).toBeInTheDocument();
  });

  test("should render movie search button", () => {
    renderWithProviders(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );

    const searchBtnElement = screen.getByRole("button");
    expect(searchBtnElement).toBeInTheDocument();
  });

  test("should render all mock movies", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    expect(screen.getAllByRole("img", { name: "movie" }).length).toBe(
      mockMovies.length
    );
    expect(store.getState().movie.movies.length).toEqual(mockMovies.length);
  });

  test('should not render "There are no movies available" h1 tag', async () => {
    renderWithProviders(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const noMovieElement = screen.getAllByRole("heading", { level: 1 });
    expect(noMovieElement.length).toEqual(1);
  });

  test('should render "There are no movies available" h1 tag', async () => {
    renderWithProviders(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>,
      {
        preloadedState: {
          movie: {
            isLoading: false,
            movies: [],
            selectedMovie: {} as IMovie,
            selectedMovieReviews: [],
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
        <Movies />
      </BrowserRouter>
    );
    const toSearchValue = "John Wick";
    const searchInputElement: HTMLInputElement = screen.getByRole("textbox");
    userEvent.type(searchInputElement, toSearchValue);
    expect(searchInputElement.value).toBe(toSearchValue);
  });

  test("should show empty field error message", () => {
    renderWithProviders(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );

    const searchInputElement: HTMLInputElement = screen.getByRole("textbox");
    const searchBtnElement = screen.getByRole("button");
    userEvent.type(searchInputElement, " ");
    userEvent.click(searchBtnElement);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  test("should show searched movies card", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );

    const searchInputElement: HTMLInputElement = screen.getByRole("textbox");
    const searchBtnElement = screen.getByRole("button");
    userEvent.type(searchInputElement, "john");
    userEvent.click(searchBtnElement);

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    expect(screen.getAllByRole("img", { name: "movie" }).length).toBe(3);
    expect(store.getState().movie.movies.length).toEqual(3);
  });
});

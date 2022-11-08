import {
  cleanup,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Movies } from "../../pages";
import { renderWithProviders } from "../../utils/test-utils";
import { mockMovies, mockSearchedMovies } from "../../utils/db.mocks";
import { IMovie } from "../../utils/types";

describe("<Movies />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );
  };
  afterEach(cleanup);

  test("should render search input", () => {
    renderApp();

    const searchInputElement = screen.getByRole("textbox");
    expect(searchInputElement).toBeInTheDocument();
  });

  test("should render search button", () => {
    renderApp();

    const searchBtnElement = screen.getByRole("button");
    expect(searchBtnElement).toBeInTheDocument();
  });

  test("should render all mock movies", async () => {
    const { store } = renderApp();

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    expect(screen.getAllByRole("img", { name: "movie" }).length).toBe(
      mockMovies.length
    );
    expect(store.getState().movie.movies.length).toEqual(mockMovies.length);
    expect(store.getState().movie.movies).toEqual(mockMovies);
  });

  test('should not render "There are no movies available"', async () => {
    renderApp();

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const noMovieElement = screen.getAllByRole("heading", { level: 1 });
    expect(noMovieElement.length).toEqual(1);
  });

  test('should render "There are no movies available"', async () => {
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
    renderApp();

    const toSearchValue = "John Wick";
    const searchInputElement: HTMLInputElement = screen.getByRole("textbox");
    userEvent.type(searchInputElement, toSearchValue);
    expect(searchInputElement.value).toBe(toSearchValue);
  });

  test("should show empty field error message", () => {
    renderApp();

    const searchInputElement: HTMLInputElement = screen.getByRole("textbox");
    const searchBtnElement = screen.getByRole("button");
    userEvent.type(searchInputElement, " ");
    userEvent.click(searchBtnElement);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  test("should show searched movies card", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    // Render all movies first
    expect(screen.getAllByRole("img", { name: "movie" }).length).toBe(
      mockMovies.length
    );

    // Perform movie search
    const searchInputElement: HTMLInputElement = screen.getByRole("textbox");
    const searchBtnElement = screen.getByRole("button");
    userEvent.type(searchInputElement, "john");
    userEvent.click(searchBtnElement);

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    expect(screen.queryByText("Please wait.")).not.toBeInTheDocument();

    // Render all searched movies. Based on mock, all three john wick movies will be rendered.
    const searchedMovies = await screen.findAllByTestId("movieCard");
    expect(searchedMovies.length).toBe(3);
    expect(store.getState().movie.movies.length).toEqual(
      mockSearchedMovies.length
    );
    expect(store.getState().movie.movies).toEqual(mockSearchedMovies);
  });
});

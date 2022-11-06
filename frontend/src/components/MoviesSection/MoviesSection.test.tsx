import {
  cleanup,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { MoviesSection } from "..";
import { renderWithProviders } from "../../utils/test-utils";
import { mockMovies } from "../../utils/db.mocks";
import { server } from "../../mocks/server";

// Enable API mocking before tests.
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe("Test Movies Section Component", () => {
  afterEach(cleanup);

  test("should render movie card element inside container div", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <MoviesSection />
      </BrowserRouter>
    );
    const movieCardContainerElement = screen.getByTestId("movieCardContainer");
    const movieCard = await screen.findAllByTestId("movieCard");

    expect(movieCardContainerElement).toContainElement(movieCard[0]);
    expect(screen.getAllByRole("img", { name: "movie" }).length).toBe(
      mockMovies.length
    );
    expect(store.getState().movie.movies.length).toEqual(mockMovies.length);
  });

  test('should not render "There are no movies available" h1 tag', async () => {
    renderWithProviders(
      <BrowserRouter>
        <MoviesSection />
      </BrowserRouter>
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const noMovieElement = screen.getAllByRole("heading", { level: 1 });
    expect(noMovieElement.length).toEqual(1);
  });

  test("should navigate me to '/movies' route when 'Movies Library' is clicked", () => {
    renderWithProviders(
      <BrowserRouter>
        <MoviesSection />
      </BrowserRouter>
    );

    const element = screen.getByText("Movies Library");
    userEvent.click(element);
    expect(window.location.pathname).toEqual("/movies");
  });

  test("should navigate me to '/movies' route when 'SEE ALL' is clicked", () => {
    renderWithProviders(
      <BrowserRouter>
        <MoviesSection />
      </BrowserRouter>
    );

    const element = screen.getByText(/see all/i);
    userEvent.click(element);
    expect(window.location.pathname).toEqual("/movies");
  });
});

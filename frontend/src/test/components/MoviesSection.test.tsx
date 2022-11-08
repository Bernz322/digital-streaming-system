import {
  cleanup,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { MoviesSection } from "../../components";
import { renderWithProviders } from "../../utils/test-utils";

describe("<MoviesSection />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <MoviesSection />
      </BrowserRouter>
    );
  };
  afterEach(cleanup);

  test("should render <MovieCard /> inside the div", async () => {
    const { store } = renderApp();
    // Wait for loading message to get removed
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    const movieCardContainerElement = screen.getByTestId("movieCardContainer"); // Section container
    const movieCard = screen.getAllByTestId("movieCard"); // <MovieCard />

    // Container should have at least 1 <MovieCard />
    expect(movieCardContainerElement).toContainElement(movieCard[0]);
    // Mocked movies has 5 objects, hence there should also be 5 movie cards
    expect(movieCard.length).toBe(5);
    // Mocked values returned from msw is stored in rtk store and should also be 5
    expect(store.getState().movie.movies.length).toEqual(5);
  });

  test('should not render "There are no movies available."', async () => {
    renderApp();

    // Mocked movies length is 5.
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    const headingElement = screen.getAllByRole("heading", { level: 1 });
    // h1 are "Movies Library" and the empty data notice
    // Since we have movies, it should only have one h1
    expect(headingElement.length).toEqual(1);
  });

  test("should navigate me to '/movies' route when 'Movies Library' is clicked", () => {
    renderApp();

    const element = screen.getByText("Movies Library");
    userEvent.click(element);
    expect(window.location.pathname).toEqual("/movies");
  });

  test("should navigate me to '/movies' route when 'SEE ALL' is clicked", () => {
    renderApp();

    const element = screen.getByText(/see all/i);
    userEvent.click(element);
    expect(window.location.pathname).toEqual("/movies");
  });
});

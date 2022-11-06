import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { MovieCard } from "..";
import { mockMovie } from "../../utils/db.mocks";
import { renderWithProviders } from "../../utils/test-utils";

describe("Test Movie Card Component", () => {
  afterEach(cleanup);

  test("should render movie image", () => {
    renderWithProviders(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    const imageElement: HTMLImageElement = screen.getByAltText("movie");
    expect(imageElement.src).toEqual(mockMovie.image);
    expect(imageElement).toBeInTheDocument();
  });

  test("should render movie title", () => {
    renderWithProviders(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    const titleElement = screen.getByRole("heading", { level: 4 });
    expect(titleElement).toHaveTextContent(mockMovie.title);
  });

  test("should render movie year released", () => {
    renderWithProviders(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    const yearElement = screen.getByTestId("movieYearReleased");
    expect(yearElement.textContent).toEqual(mockMovie.yearReleased.toString());
  });

  test("should move me to another route with complete movie details when clicked", () => {
    renderWithProviders(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    const linkElement = screen.getByRole("link");
    userEvent.click(linkElement);

    expect(window.location.pathname).toEqual(`/movie/${mockMovie.id}`);
  });
});

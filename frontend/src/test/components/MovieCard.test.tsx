import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { MovieCard } from "../../components";
import { mockMovie } from "../../utils/db.mocks";
import { renderWithProviders } from "../../utils/test-utils";

describe("<MovieCard />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );
  };
  afterEach(cleanup);

  test("should render mocked movie image", () => {
    renderApp();

    const imageElement: HTMLImageElement = screen.getByAltText("movie");
    expect(imageElement.src).toEqual(mockMovie.image);
    expect(imageElement).toBeInTheDocument();
  });

  test("should render mocked movie title", () => {
    renderApp();

    expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
      mockMovie.title
    );
  });

  test("should render mocked movie year released", () => {
    renderApp();

    expect(screen.getByTestId("movieYearReleased").textContent).toEqual(
      mockMovie.yearReleased.toString()
    );
  });

  test("should navigate to individial movie page when clicked", () => {
    renderApp();

    const linkElement = screen.getByRole("link");
    userEvent.click(linkElement);

    expect(window.location.pathname).toEqual(`/movie/${mockMovie.id}`);
  });
});

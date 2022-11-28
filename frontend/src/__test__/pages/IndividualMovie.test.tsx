import {
  cleanup,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { NotificationsProvider } from "@mantine/notifications";
import renderWithProviders from "../../utils/test-utils";
import { IndividualMovie } from "../../pages";
import { server } from "../../mocks/server";
import { baseAPIUrl } from "../../utils/apiCalls";
import { budgetFormatter } from "../../utils/helpers";
import { IUser } from "../../utils/types";
import { mockUsers } from "../../utils/db.mocks";

describe("<IndividualMovie/>", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <IndividualMovie />
      </BrowserRouter>
    );
  };
  afterEach(() => cleanup);

  test("should first render loading element", async () => {
    renderApp();
    const loadingElement = await screen.findByRole("heading", {
      name: "Please wait.",
    });

    expect(loadingElement).toHaveTextContent("Please wait");
    expect(loadingElement).toBeInTheDocument();
  });

  test("should render movie details", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    // Navigating IndividualMovie Page will populate selectedMovie state in movieSlice
    const mockedMovie = store.getState().movie.selectedMovie; // John Wick movie
    const formattedCost = budgetFormatter(mockedMovie.cost);
    const movieRating = mockedMovie.rating;

    const imageElement: HTMLImageElement = screen.getByAltText(
      mockedMovie.title
    );
    const titleElement = screen.getByRole("heading", { level: 1 });
    const descElement = screen.getByTestId("testMovieDesc");
    const costElement = screen.getByTestId("testMovieCost");
    const yearReleasedElement = screen.getByTestId("testMovieYearReleased");

    expect(imageElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(descElement).toBeInTheDocument();
    expect(costElement).toBeInTheDocument();
    expect(yearReleasedElement).toBeInTheDocument();

    expect(imageElement.src).toEqual(mockedMovie.image);
    expect(titleElement.textContent).toEqual(mockedMovie.title);
    expect(descElement.textContent).toEqual(mockedMovie.description);
    expect(costElement.textContent).toContain(formattedCost);
    expect(yearReleasedElement.textContent).toContain(
      mockedMovie.yearReleased.toString()
    );
    expect(screen.getAllByTestId("testMovieRating")[0].textContent).toContain(
      movieRating?.toString()
    );
  });

  test("should render actors/ casts cards", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    const mockedMovie = store.getState().movie.selectedMovie;
    const movieCastsLength = mockedMovie.movieCasters?.length; // Actors (2)

    expect(screen.getAllByRole("img", { name: "actor" }).length).toBe(
      movieCastsLength
    ); // <MovieCard />
    expect(screen.getByText(/keanu reeves/i)).toBeInTheDocument();
  });

  test("should render movie reviews", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    const selectedMovieSelector = store.getState().movie.selectedMovie;
    const movieReviewsLength = selectedMovieSelector.movieReviews?.length; // Movie Reviews (1)

    expect(screen.getAllByTestId("reviewCardDescription").length).toBe(
      movieReviewsLength
    );
    expect(store.getState().movie.selectedMovie.movieReviews?.length).toEqual(
      movieReviewsLength
    );
    expect(screen.getByText(/jeffrey/i)).toBeInTheDocument();
  });

  test("should disable submit review button and text area if the user is not logged in", async () => {
    renderWithProviders(
      <BrowserRouter>
        <IndividualMovie />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            isLoading: false,
            loggedIn: false,
            user: {} as IUser,
          },
        },
      }
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const textAreaElement = screen.getByRole("textbox", {
      name: "Give your review to this movie.",
    });
    const btnElement = screen.getByRole("button", {
      name: "Please login to submit review",
    });

    expect(textAreaElement).toBeDisabled();
    expect(btnElement).toBeDisabled();
  });

  test("should not disable submit review button and text area if the user is logged in", async () => {
    renderWithProviders(
      <BrowserRouter>
        <IndividualMovie />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            isLoading: false,
            loggedIn: true,
            user: mockUsers[0],
          },
        },
      }
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const textAreaElement = screen.getByRole("textbox", {
      name: "Give your review to this movie.",
    });
    const btnElement = screen.getByRole("button", {
      name: "Submit Review",
    });

    expect(textAreaElement).not.toBeDisabled();
    expect(btnElement).not.toBeDisabled();
  });

  test("should show empty field error message", async () => {
    renderWithProviders(
      <BrowserRouter>
        <IndividualMovie />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            isLoading: false,
            loggedIn: true,
            user: mockUsers[0],
          },
        },
      }
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const textAreaElement = screen.getByRole("textbox", {
      name: "Give your review to this movie.",
    });
    const btnElement = screen.getByRole("button", {
      name: "Submit Review",
    });

    userEvent.type(textAreaElement, " ");
    userEvent.click(btnElement);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  test("should render 'Your review was successfully received.' alert after review submission'", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <IndividualMovie />
        </NotificationsProvider>
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            isLoading: false,
            loggedIn: true,
            user: mockUsers[1],
          },
        },
      }
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const textAreaElement = screen.getByRole("textbox", {
      name: "Give your review to this movie.",
    });
    const btnElement = screen.getByRole("button", {
      name: "Submit Review",
    });

    userEvent.type(textAreaElement, "This is very good.");
    userEvent.click(btnElement);

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/Please wait for admin approval/i);
  });

  test("should render 'You can only review once per movie.' after review submission again", async () => {
    server.use(
      rest.post(`${baseAPIUrl}/reviews`, (req, res, ctx) => {
        return res(
          ctx.json({
            status: "fail",
            data: null,
            message: "You can only review once per movie.",
          }),
          ctx.delay(150)
        );
      })
    );
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <IndividualMovie />
        </NotificationsProvider>
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            isLoading: false,
            loggedIn: true,
            user: mockUsers[0],
          },
        },
      }
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const textAreaElement = screen.getByRole("textbox", {
      name: "Give your review to this movie.",
    });
    const btnElement = screen.getByRole("button", {
      name: "Submit Review",
    });

    userEvent.type(textAreaElement, "This is very good.");
    userEvent.click(btnElement);

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(
      /You can only review once per movie/i
    );
  });
});

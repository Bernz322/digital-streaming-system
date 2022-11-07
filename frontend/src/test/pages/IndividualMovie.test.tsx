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
import { renderWithProviders } from "../../utils/test-utils";
import { IndividualMovie } from "../../pages";
import { server } from "../../mocks/server";
import { baseAPIUrl } from "../../utils/apiCalls";
import { budgetFormatter } from "../../utils/helpers";
import { IUserLogin } from "../../utils/types";

describe("Test Individual Movie Page", () => {
  afterEach(() => cleanup);

  test("should first render loading element", async () => {
    renderWithProviders(
      <BrowserRouter>
        <IndividualMovie />
      </BrowserRouter>
    );

    const loadingElement = await screen.findByRole("heading", {
      name: "Please wait.",
    });

    expect(loadingElement).toHaveTextContent("Please wait");
    expect(loadingElement).toBeInTheDocument();
  });

  test("should render movie details", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <IndividualMovie />
      </BrowserRouter>
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    // Navigating IndividualMovie Page will populate selectedMovie state in movieSlice
    const movieFromSelector = store.getState().movie.selectedMovie;
    const formattedCost = budgetFormatter(movieFromSelector.cost);
    const movieRating = movieFromSelector.rating;

    const imageElement: HTMLImageElement = screen.getByAltText(
      movieFromSelector.title
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

    expect(imageElement.src).toEqual(movieFromSelector.image);
    expect(titleElement.textContent).toEqual(movieFromSelector.title);
    expect(descElement.textContent).toEqual(movieFromSelector.description);
    expect(costElement.textContent).toContain(formattedCost);
    expect(yearReleasedElement.textContent).toContain(
      movieFromSelector.yearReleased.toString()
    );
    expect(screen.getAllByTestId("testMovieRating")[0].textContent).toContain(
      movieRating?.toString()
    );
  });

  test("should render actors/ casts cards", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <IndividualMovie />
      </BrowserRouter>
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    const selectedMovieSelector = store.getState().movie.selectedMovie;
    const movieCastsLength = selectedMovieSelector.movieCasters?.length;
    const movieReviewsLength = selectedMovieSelector.movieReviews?.length;

    expect(screen.getAllByRole("img", { name: "actor" }).length).toBe(
      movieCastsLength
    );
    expect(store.getState().movie.selectedMovie.movieReviews?.length).toEqual(
      movieReviewsLength
    );
    expect(screen.getByText(/keanu reeves/i)).toBeInTheDocument();
  });

  test("should render movie reviews", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <IndividualMovie />
      </BrowserRouter>
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    const selectedMovieSelector = store.getState().movie.selectedMovie;
    const movieReviewsLength = selectedMovieSelector.movieReviews?.length;

    expect(screen.getAllByTestId("reviewCardDescription").length).toBe(
      movieReviewsLength
    );
    expect(store.getState().movie.selectedMovie.movieReviews?.length).toEqual(
      movieReviewsLength
    );
    expect(screen.getByText(/jeffrey/i)).toBeInTheDocument();
  });

  test("should disable submit review button and text area if not logged in", async () => {
    renderWithProviders(
      <BrowserRouter>
        <IndividualMovie />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            isLoading: false,
            loggedIn: false,
            user: {} as IUserLogin,
          },
        },
      }
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const textAreaElement = screen.getByTestId("reviewTextArea");
    const btnElement = screen.getAllByRole("button")[2];

    expect(textAreaElement).toBeDisabled();
    expect(btnElement).toBeDisabled();
  });

  test("should not disable submit review button and text area if logged in", async () => {
    renderWithProviders(
      <BrowserRouter>
        <IndividualMovie />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            isLoading: false,
            loggedIn: true,
            user: {
              id: "6365cbc3e303fc6228363b9d",
              name: "admin root",
              email: "admin@root.com",
              role: "admin",
              isActivated: true,
            },
          },
        },
      }
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const textAreaElement = screen.getByTestId("reviewTextArea");
    const btnElement = screen.getAllByRole("button")[2];

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
            user: {
              id: "6365cbc3e303fc6228363b9d",
              name: "admin root",
              email: "admin@root.com",
              role: "admin",
              isActivated: true,
            },
          },
        },
      }
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const textAreaElement = screen.getByTestId("reviewTextArea");
    const btnElement = screen.getAllByRole("button")[2];

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
            user: {
              id: "6365cbc3e303fc6228363b9d",
              name: "admin root",
              email: "admin@root.com",
              role: "admin",
              isActivated: true,
            },
          },
        },
      }
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const textAreaElement = screen.getByTestId("reviewTextArea");
    const btnElement = screen.getAllByRole("button")[2];

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
            user: {
              id: "6365cbc3e303fc6228363b9d",
              name: "admin root",
              email: "admin@root.com",
              role: "admin",
              isActivated: true,
            },
          },
        },
      }
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const textAreaElement = screen.getByTestId("reviewTextArea");
    const btnElement = screen.getAllByRole("button")[2];

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

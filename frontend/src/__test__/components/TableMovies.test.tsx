import {
  cleanup,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { NotificationsProvider } from "@mantine/notifications";
import { TableMovies } from "../../components";
import { renderWithProviders } from "../../utils/test-utils";
import { mockMovies } from "../../utils/db.mocks";

interface IForm {
  title?: string;
  desc?: string;
  budget?: string;
  year?: string;
  imageUrl?: string;
}

const openAddMovieModal = async () => {
  const addMovieBtnElement = screen.getByRole("button", {
    name: "Add Movie",
  });
  expect(addMovieBtnElement).toBeInTheDocument();
  userEvent.click(addMovieBtnElement);

  const addMovieModalElement = await screen.findByRole("dialog");
  await waitFor(() => {
    expect(addMovieModalElement).toBeInTheDocument();
  });
  expect(addMovieModalElement).toHaveTextContent("Add Movie");
};

const openUpdateMovieModal = async () => {
  const updateMovieBtnElement = screen.getAllByTestId("rowUpdateMovieBtn");
  //   Select John Wick movie
  await waitFor(() => {
    expect(updateMovieBtnElement[1]).toBeInTheDocument();
  });
  userEvent.click(updateMovieBtnElement[1]);

  const updateUserModalElement = await screen.findByRole("dialog");
  await waitFor(() => {
    expect(updateUserModalElement).toBeInTheDocument();
  });
};

const typeIntoAddForm = ({ title, desc, budget, year, imageUrl }: IForm) => {
  const titleElement = screen.getByRole("textbox", { name: "Movie Title" });
  const descElement = screen.getByRole("textbox", {
    name: "Movie Description",
  });
  const budgetElement: HTMLInputElement = screen.getByRole("textbox", {
    name: "Movie Budget Cost",
  });
  const yearElement: HTMLInputElement = screen.getByRole("textbox", {
    name: "Movie Year Released",
  });
  const imageURLElement = screen.getByRole("textbox", { name: "Movie image" });

  if (title) {
    userEvent.type(titleElement, title);
  }
  if (desc) {
    userEvent.type(descElement, desc);
  }
  if (budget) {
    // Clear input field
    budgetElement.setSelectionRange(0, budgetElement.value.length);
    userEvent.type(budgetElement, budget.toString());
  }
  if (year) {
    // Clear input field
    yearElement.setSelectionRange(0, yearElement.value.length);
    userEvent.type(yearElement, year);
  }
  if (imageUrl) {
    userEvent.type(imageURLElement, imageUrl);
  }
};

describe("<TableMovies />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableMovies />
        </NotificationsProvider>
      </BrowserRouter>
    );
  };
  afterEach(cleanup);

  test("should render all mocked movies data", async () => {
    const { store } = renderApp();

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const tableRows = screen.getAllByRole("row");
    // Extra one is from the table head row
    expect(tableRows.length - 1).toEqual(mockMovies.length);
    expect(store.getState().movie.movies.length).toEqual(mockMovies.length);
  });

  test("should render search input and 'Add Movie' button", async () => {
    renderApp();

    const addMovieBtnElement = screen.getByRole("button", {
      name: "Add Movie",
    });
    const searchMovieInputElement =
      screen.getByPlaceholderText("Search movie title");
    expect(addMovieBtnElement).toBeInTheDocument();
    expect(searchMovieInputElement).toBeInTheDocument();
  });

  test("should render 'Enola Holmes 2' in table row after typing 'holmes 2'", async () => {
    renderApp();

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const searchMovieInputElement =
      screen.getByPlaceholderText("Search movie title");
    userEvent.type(searchMovieInputElement, "holmes 2");

    await waitFor(() =>
      expect(searchMovieInputElement).toHaveValue("holmes 2")
    );
    const tableRows = screen.getAllByRole("row");

    expect(tableRows[1]).toHaveTextContent(/Enola Holmes 2/i);
  });

  test("should render 'Add Movie' Modal if 'Add Movie' button is clicked", async () => {
    renderApp();
    openAddMovieModal();
  });

  test("should alert 'Field movie title is required.' after add movie button is clicked in modal", async () => {
    renderApp();
    openAddMovieModal();

    const addMovieModalBtnElement = screen.getByRole("button", {
      name: "Add Movie",
    });
    typeIntoAddForm({ title: " " });
    userEvent.click(addMovieModalBtnElement);

    const alertElement = await screen.findByText(/Adding movie failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Field movie title is required.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Field movie description is required.' after add movie button is clicked in modal", async () => {
    renderApp();
    openAddMovieModal();

    const addMovieModalBtnElement = screen.getByRole("button", {
      name: "Add Movie",
    });
    typeIntoAddForm({ title: "validTitle", desc: " " });
    userEvent.click(addMovieModalBtnElement);

    const alertElement = await screen.findByText(/Adding movie failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText(
      "Field movie description is required."
    );
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Movie budget cost cannot be less than 0.' after add movie button is clicked in modal", async () => {
    renderApp();
    openAddMovieModal();

    const addMovieModalBtnElement = screen.getByRole("button", {
      name: "Add Movie",
    });
    typeIntoAddForm({ title: "validTitle", desc: "validDesc", budget: "0" });
    userEvent.click(addMovieModalBtnElement);

    const alertElement = await screen.findByText(/Adding movie failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText(
      "Movie budget cost cannot be less than 0."
    );
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Movie year released cannot be of negative value.' after add movie button is clicked in modal", async () => {
    renderApp();
    openAddMovieModal();

    const addMovieModalBtnElement = screen.getByRole("button", {
      name: "Add Movie",
    });
    typeIntoAddForm({
      title: "validTitle",
      desc: "validDesc",
      budget: "2300",
      year: "-2000",
    });
    userEvent.click(addMovieModalBtnElement);

    const alertElement = await screen.findByText(/Adding movie failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText(
      "Movie year released cannot be of negative value."
    );
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Invalid movie image url.' after add movie button is clicked in modal", async () => {
    renderApp();
    openAddMovieModal();

    const addMovieModalBtnElement = screen.getByRole("button", {
      name: "Add Movie",
    });
    typeIntoAddForm({
      title: "validTitle",
      desc: "validDesc",
      budget: "2300",
      year: "2000",
      imageUrl: "invalidUrl",
    });
    userEvent.click(addMovieModalBtnElement);

    const alertElement = await screen.findByText(/Adding movie failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid movie image url.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should close 'Add Movie' modal on 'X' button click", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    const addMovieBtnElement = screen.getByRole("button", {
      name: "Add Movie",
    });
    userEvent.click(addMovieBtnElement);

    const addMovieModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(addMovieModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[0]); // Button X

    expect(addMovieModalElement).not.toBeInTheDocument();
  });

  test("should render 'Update Movie' Modal if row movies button is clicked", async () => {
    renderApp();

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    openUpdateMovieModal();
  });

  test("should render John Wick movie data in the modal after the row update btn is clicked", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const mockedMovies = store.getState().movie.movies; // [0]->John Wick / [1]->John Wick 2 / [2]->John Wick 3
    const jWick = mockedMovies[0];

    const updateMovieBtnElement = screen.getAllByTestId("rowUpdateMovieBtn");
    await waitFor(() => {
      expect(updateMovieBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateMovieBtnElement[0]);

    const updateMovieModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateMovieModalElement).toBeInTheDocument();
    });

    const descElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Movie Description",
    });
    const costElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Movie Budget Cost",
    });
    const imageURLElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Movie image",
    });

    expect(descElement.value).toBe(jWick.description);
    expect(costElement.value).toBe(jWick.cost.toString());
    expect(imageURLElement.value).toBe(jWick.image);
  });

  test("should alert 'Field movie description is required.' during update", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const updateMovieBtnElement = screen.getAllByTestId("rowUpdateMovieBtn");
    await waitFor(() => {
      expect(updateMovieBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateMovieBtnElement[0]);

    const updateMovieModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateMovieModalElement).toBeInTheDocument();
    });

    const updateMovieModalBtnElement = screen.getAllByRole("button")[1];

    const descElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Movie Description",
    });

    descElement.setSelectionRange(0, descElement.value.length);
    userEvent.type(descElement, " ");
    userEvent.click(updateMovieModalBtnElement);

    const alertElement = await screen.findByText(/Updating movie failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText(
      "Field movie description is required."
    );
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Movie budget cost cannot be less than 0.' during update", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const updateMovieBtnElement = screen.getAllByTestId("rowUpdateMovieBtn");
    await waitFor(() => {
      expect(updateMovieBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateMovieBtnElement[0]);

    const updateMovieModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateMovieModalElement).toBeInTheDocument();
    });

    const updateMovieModalBtnElement = screen.getAllByRole("button")[1];

    const costElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Movie Budget Cost",
    });

    costElement.setSelectionRange(0, costElement.value.length);
    userEvent.type(costElement, " ");
    userEvent.click(updateMovieModalBtnElement);

    const alertElement = await screen.findByText(/Updating movie failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText(
      "Movie budget cost cannot be less than 0."
    );
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Field movie image is required.' during update", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const updateMovieBtnElement = screen.getAllByTestId("rowUpdateMovieBtn");
    await waitFor(() => {
      expect(updateMovieBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateMovieBtnElement[0]);

    const updateMovieModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateMovieModalElement).toBeInTheDocument();
    });

    const updateMovieModalBtnElement = screen.getAllByRole("button")[1];

    const imageURLElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Movie image",
    });

    imageURLElement.setSelectionRange(0, imageURLElement.value.length);
    userEvent.type(imageURLElement, " ");
    userEvent.click(updateMovieModalBtnElement);

    const alertElement = await screen.findByText(/Updating movie failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Field movie image is required.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should close 'Update Movie' modal on 'X' button click", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    // Open Modal
    const updateMovieBtnElement = screen.getAllByTestId("rowUpdateMovieBtn");
    await waitFor(() => {
      expect(updateMovieBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateMovieBtnElement[0]);

    const updateMovieModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateMovieModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[0]); // Button X

    expect(updateMovieModalElement).not.toBeInTheDocument();
  });

  test("should navigate me to individual movie route with their id", async () => {
    const history = createMemoryHistory();
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <NotificationsProvider>
          <TableMovies />
        </NotificationsProvider>
      </Router>
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    const movieEnola1 = store.getState().movie.movies[3];
    // Find all view movie buttons
    const viewMovieBtnElement = screen.getAllByTestId("rowViewMovieBtn");
    await waitFor(() => {
      expect(viewMovieBtnElement[3]).toBeInTheDocument(); // Movie Bridget btn
    });
    userEvent.click(viewMovieBtnElement[3]);

    expect(history.location.pathname).toEqual(`/movie/${movieEnola1.id}`);
  });

  test("should close delete actor modal on 'X' button click", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const deleteMovieBtnElement = screen.getAllByTestId("rowDeleteMovieBtn");
    await waitFor(() => {
      expect(deleteMovieBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(deleteMovieBtnElement[0]);

    const deleteMovieModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(deleteMovieModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[0]); // Button X

    expect(deleteMovieModalElement).not.toBeInTheDocument();
  });

  test("should close delete actor modal on 'No' button click", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const deleteMovieBtnElement = screen.getAllByTestId("rowDeleteMovieBtn");
    await waitFor(() => {
      expect(deleteMovieBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(deleteMovieBtnElement[0]);

    const deleteMovieModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(deleteMovieModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[2]); // Button with No text

    expect(deleteMovieModalElement).not.toBeInTheDocument();
  });

  test("should delete movie 'John Wick' on 'Yes' button click", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const deleteMovieBtnElement = screen.getAllByTestId("rowDeleteMovieBtn");
    await waitFor(() => {
      expect(deleteMovieBtnElement[1]).toBeInTheDocument(); // Movie John Wick btn
    });
    userEvent.click(deleteMovieBtnElement[1]);

    // Opened Modal
    const deleteMovieModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(deleteMovieModalElement).toBeInTheDocument();
    });

    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[1]); // Button with Yes text

    expect(deleteMovieModalElement).not.toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    // Initially, store movie state has 5 movies from msw mock, after deletion of John Wick, 4 will remain.
    expect(store.getState().movie.movies.length).toBe(4);
  });
});

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
import { TableActors } from "../../components";
import { renderWithProviders } from "../../utils/test-utils";
import { mockActors } from "../../utils/db.mocks";

const openUpdateActorModal = async () => {
  const updateActorBtnElement = screen.getAllByTestId("rowUpdateActorBtn");
  //   Select Keanu Mock actor
  await waitFor(() => {
    expect(updateActorBtnElement[0]).toBeInTheDocument();
  });
  userEvent.click(updateActorBtnElement[0]);

  const updateUserModalElement = await screen.findByRole("dialog");
  await waitFor(() => {
    expect(updateUserModalElement).toBeInTheDocument();
  });
};

describe("<TableActors />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableActors />
        </NotificationsProvider>
      </BrowserRouter>
    );
  };
  afterEach(cleanup);

  test("should render all mocked actors data", async () => {
    const { store } = renderApp();

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const tableRows = screen.getAllByRole("row");

    // Extra one is from the table head row
    expect(tableRows.length - 1).toEqual(mockActors.length);
    expect(store.getState().actor.actors.length).toEqual(mockActors.length);
  });

  test("should render search input and 'Add Actor' button", async () => {
    renderApp();

    const addActorBtnElement = screen.getByRole("button", {
      name: "Add Actor",
    });
    const searchActorInputElement =
      screen.getByPlaceholderText("Search actor name");
    expect(addActorBtnElement).toBeInTheDocument();
    expect(searchActorInputElement).toBeInTheDocument();
  });

  test("should render 'Bridget' in table row after typing 'bridget'", async () => {
    renderApp();

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const searchActorInputElement =
      screen.getByPlaceholderText("Search actor name");
    userEvent.type(searchActorInputElement, "bridget");

    await waitFor(() => expect(searchActorInputElement).toHaveValue("bridget"));
    const tableRows = screen.getAllByRole("row");

    expect(tableRows[1]).toHaveTextContent(/BridgetMoynahan/i);
  });

  test("should render 'Update Actor' Modal if row actor button is clicked", async () => {
    renderApp();

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    openUpdateActorModal();
  });

  test("should render Keanu Reeves actor data in the modal after his update btn is clicked", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const mockedActors = store.getState().actor.actors; // [0]->Keanu / [1]->Bridget / [2]->Adrianne
    const keanu = mockedActors[0];

    const updateActorBtnElement = screen.getAllByTestId("rowUpdateActorBtn");
    await waitFor(() => {
      expect(updateActorBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateActorBtnElement[0]);

    const updateActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateActorModalElement).toBeInTheDocument();
    });

    const fNameElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "First Name",
    });
    const lNameElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Last Name",
    });
    const ageElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Actor age",
    });
    const linkElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Actor Link",
    });
    const imageURLElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Actor Image",
    });

    expect(fNameElement).toHaveValue(keanu.firstName);
    expect(lNameElement).toHaveValue(keanu.lastName);
    expect(ageElement).toHaveValue(keanu.age.toString());
    expect(linkElement).toHaveValue(keanu.link);
    expect(imageURLElement).toHaveValue(keanu.image);
  });

  test("should alert 'Invalid first name.' after update actor button is clicked in modal", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const updateActorBtnElement = screen.getAllByTestId("rowUpdateActorBtn");
    //   Select Keanu Mock actor
    await waitFor(() => {
      expect(updateActorBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateActorBtnElement[0]);

    const updateActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateActorModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const fNameElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "First Name",
    });
    const updateActorModalBtnElement = screen.getAllByRole("button")[1];

    // Type invalid name
    userEvent.type(fNameElement, "123");

    userEvent.click(updateActorModalBtnElement);

    const alertElement = await screen.findByText(/Updating actor failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid first name.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Invalid last name.' after update actor button is clicked in modal", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const updateActorBtnElement = screen.getAllByTestId("rowUpdateActorBtn");
    //   Select Keanu Mock actor
    await waitFor(() => {
      expect(updateActorBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateActorBtnElement[0]);

    const updateActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateActorModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const lNameElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Last Name",
    });
    const updateActorModalBtnElement = screen.getAllByRole("button")[1];

    // Type invalid name
    userEvent.type(lNameElement, "123");

    userEvent.click(updateActorModalBtnElement);

    const alertElement = await screen.findByText(/Updating actor failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid last name.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Actor age cannot be less than a year.' after update actor button is clicked in modal", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const updateActorBtnElement = screen.getAllByTestId("rowUpdateActorBtn");
    //   Select Keanu Mock actor
    await waitFor(() => {
      expect(updateActorBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateActorBtnElement[0]);

    const updateActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateActorModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const ageElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Actor age",
    });
    const updateActorModalBtnElement = screen.getAllByRole("button")[1];

    // Clear input field
    ageElement.setSelectionRange(0, ageElement.value.length);
    // Type negative age
    userEvent.type(ageElement, "-1");

    userEvent.click(updateActorModalBtnElement);

    const alertElement = await screen.findByText(/Updating actor failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText(
      "Actor age cannot be less than a year."
    );
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Invalid actor image url.' after update actor button is clicked in modal", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const updateActorBtnElement = screen.getAllByTestId("rowUpdateActorBtn");
    //   Select Keanu Mock actor
    await waitFor(() => {
      expect(updateActorBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateActorBtnElement[0]);

    const updateActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateActorModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const imageURLElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Actor Image",
    });
    const updateActorModalBtnElement = screen.getAllByRole("button")[1];

    // Clear input field
    imageURLElement.setSelectionRange(0, imageURLElement.value.length);
    // Type invalid url age
    userEvent.type(imageURLElement, "invalidURL");

    userEvent.click(updateActorModalBtnElement);

    const alertElement = await screen.findByText(/Updating actor failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid actor image url.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Invalid actor link url.' after update actor button is clicked in modal", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const updateActorBtnElement = screen.getAllByTestId("rowUpdateActorBtn");
    //   Select Keanu Mock actor
    await waitFor(() => {
      expect(updateActorBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateActorBtnElement[0]);

    const updateActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateActorModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const linkElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Actor Link",
    });
    const updateActorModalBtnElement = screen.getAllByRole("button")[1];

    // Clear input field
    linkElement.setSelectionRange(0, linkElement.value.length);
    // Type invalid url age
    userEvent.type(linkElement, "invalidURL");

    userEvent.click(updateActorModalBtnElement);

    const alertElement = await screen.findByText(/Updating actor failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid actor link url.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should close 'Update Actor' modal on 'X' button click", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    // Open Modal
    const updateActorBtnElement = screen.getAllByTestId("rowUpdateActorBtn");
    //   Select Keanu Mock actor
    await waitFor(() => {
      expect(updateActorBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateActorBtnElement[0]);

    const updateActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateActorModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[0]); // Button X

    expect(updateActorModalElement).not.toBeInTheDocument();
  });

  test("should change gender of Keanu modal on radio btn click", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    // Open Modal
    const updateActorBtnElement = screen.getAllByTestId("rowUpdateActorBtn");
    //   Select Keanu Mock actor
    await waitFor(() => {
      expect(updateActorBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(updateActorBtnElement[0]);

    const updateActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateActorModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const femaleRadioBtnElement: HTMLInputElement = screen.getByRole("radio", {
      name: "Female",
    });
    userEvent.click(femaleRadioBtnElement);

    expect(femaleRadioBtnElement.value).toBe("female");
  });

  test("should close delete actor modal on 'X' button click", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const deleteActorBtnElement = screen.getAllByTestId("rowDeleteActorBtn");
    //   Select Keanu Mock actor
    await waitFor(() => {
      expect(deleteActorBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(deleteActorBtnElement[0]);

    const deleteActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(deleteActorModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[0]); // Button X

    expect(deleteActorModalElement).not.toBeInTheDocument();
  });

  test("should close delete actor modal on 'No' button click", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const deleteActorBtnElement = screen.getAllByTestId("rowDeleteActorBtn");
    //   Select Keanu Mock actor
    await waitFor(() => {
      expect(deleteActorBtnElement[0]).toBeInTheDocument();
    });
    userEvent.click(deleteActorBtnElement[0]);

    const deleteActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(deleteActorModalElement).toBeInTheDocument();
    });

    // Opened Modal

    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[2]); // Button with No text

    expect(deleteActorModalElement).not.toBeInTheDocument();
  });

  test("should delete actor 'Bridget' on 'Yes' button click", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const deleteActorBtnElement = screen.getAllByTestId("rowDeleteActorBtn");
    await waitFor(() => {
      expect(deleteActorBtnElement[1]).toBeInTheDocument(); // Actor Bridget btn
    });
    userEvent.click(deleteActorBtnElement[1]);

    // Opened Modal
    const deleteActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(deleteActorModalElement).toBeInTheDocument();
    });

    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[1]); // Button with Yes text

    expect(deleteActorModalElement).not.toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    // Initially, store actor state has 3 actors from msw mock, Keanu, Bridget and Adrianne, after deletion of Bridget, 2 will remain.
    expect(store.getState().actor.actors.length).toBe(2);
  });

  test("should navigate me to individual actor route with their id", async () => {
    const history = createMemoryHistory();
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <NotificationsProvider>
          <TableActors />
        </NotificationsProvider>
      </Router>
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    const actorBridget = store.getState().actor.actors[1];
    // Find all view actor buttons
    const viewActorBtnElement = screen.getAllByTestId("rowViewActorBtn");
    await waitFor(() => {
      expect(viewActorBtnElement[1]).toBeInTheDocument(); // Actor Bridget btn
    });
    userEvent.click(viewActorBtnElement[1]);

    expect(history.location.pathname).toEqual(`/actor/${actorBridget.id}`);
  });
});

import {
  cleanup,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { NotificationsProvider } from "@mantine/notifications";
import { TableActors } from "../../components";
import { renderWithProviders } from "../../utils/test-utils";
import { mockActors } from "../../utils/db.mocks";

interface IForm {
  fName?: string;
  lName?: string;
  age?: number;
  link?: string;
  imageUrl?: string;
}

const openAddActorModal = async () => {
  const addActorBtnElement = screen.getByRole("button", { name: "Add Actor" });
  userEvent.click(addActorBtnElement);

  const addActorModalElement = await screen.findByRole("dialog");
  await waitFor(() => {
    expect(addActorModalElement).toBeInTheDocument();
  });
};

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

const typeIntoAddForm = ({ fName, lName, age, link, imageUrl }: IForm) => {
  const fNameElement = screen.getByRole("textbox", { name: "First Name" });
  const lNameElement = screen.getByRole("textbox", { name: "Last Name" });
  const ageElement = screen.getByRole("textbox", { name: "Actor age" });
  const linkElement = screen.getByRole("textbox", { name: "Actor Link" });
  const imageURLElement = screen.getByRole("textbox", { name: "Actor Image" });

  if (fName) {
    userEvent.type(fNameElement, fName);
  }
  if (lName) {
    userEvent.type(lNameElement, lName);
  }
  if (age) {
    userEvent.type(ageElement, age.toString());
  }
  if (link) {
    userEvent.type(linkElement, link);
  }
  if (imageUrl) {
    userEvent.type(imageURLElement, imageUrl);
  }
};

describe("Test Table Actors Component", () => {
  afterEach(cleanup);

  test("should render all mocked actors data", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <TableActors />
      </BrowserRouter>
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const tableRows = screen.getAllByRole("row");

    // Extra one is from the table head row
    expect(tableRows.length - 1).toEqual(mockActors.length);
    expect(store.getState().actor.actors.length).toEqual(mockActors.length);
  });

  test("should render search input and 'Add Actor' button", async () => {
    renderWithProviders(
      <BrowserRouter>
        <TableActors />
      </BrowserRouter>
    );

    const addActorBtnElement = screen.getByRole("button", {
      name: "Add Actor",
    });
    const searchActorInputElement =
      screen.getByPlaceholderText("Search actor name");
    expect(addActorBtnElement).toBeInTheDocument();
    expect(searchActorInputElement).toBeInTheDocument();
  });

  test("should render 'Bridget' in table row after typing 'bridget'", async () => {
    renderWithProviders(
      <BrowserRouter>
        <TableActors />
      </BrowserRouter>
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const searchActorInputElement =
      screen.getByPlaceholderText("Search actor name");
    userEvent.type(searchActorInputElement, "bridget");

    await waitFor(() => expect(searchActorInputElement).toHaveValue("bridget"));
    const tableRows = screen.getAllByRole("row");

    expect(tableRows[1]).toHaveTextContent(/BridgetMoynahan/i);
  });

  test("should render 'Add Actor' Modal if 'Add Actor' button is clicked", async () => {
    renderWithProviders(
      <BrowserRouter>
        <TableActors />
      </BrowserRouter>
    );

    const addActorBtnElement = screen.getByRole("button", {
      name: "Add Actor",
    });
    expect(addActorBtnElement).toBeInTheDocument();
    userEvent.click(addActorBtnElement);

    const addActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(addActorModalElement).toBeInTheDocument();
    });
    expect(addActorModalElement).toHaveTextContent("Add Actor");
  });

  test("should alert 'Field first name is required.' after add actor button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableActors />
        </NotificationsProvider>
      </BrowserRouter>
    );

    openAddActorModal();

    const addActorModalBtnElement = screen.getByRole("button", {
      name: "Add Actor",
    });
    typeIntoAddForm({ fName: " " });
    userEvent.click(addActorModalBtnElement);

    const alertElement = await screen.findByText(/Adding actor failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Field first name is required.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Invalid last name.' after add actor button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableActors />
        </NotificationsProvider>
      </BrowserRouter>
    );

    openAddActorModal();

    const addActorModalBtnElement = screen.getByRole("button", {
      name: "Add Actor",
    });
    typeIntoAddForm({ fName: "Valid Actor", lName: "123" });
    userEvent.click(addActorModalBtnElement);

    const alertElement = await screen.findByText(/Adding actor failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid last name.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Actor age cannot be less than a year.' after add actor button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableActors />
        </NotificationsProvider>
      </BrowserRouter>
    );

    openAddActorModal();

    const addActorModalBtnElement = screen.getByRole("button", {
      name: "Add Actor",
    });
    typeIntoAddForm({ fName: "Valid Actor", lName: "Name", age: 0 });
    userEvent.click(addActorModalBtnElement);

    const alertElement = await screen.findByText(/Adding actor failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText(
      "Actor age cannot be less than a year."
    );
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Invalid actor image url.' after add actor button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableActors />
        </NotificationsProvider>
      </BrowserRouter>
    );

    openAddActorModal();

    const addActorModalBtnElement = screen.getByRole("button", {
      name: "Add Actor",
    });
    typeIntoAddForm({
      fName: "Valid Actor",
      lName: "Name",
      age: 1,
      imageUrl: "invalidUrl",
    });
    userEvent.click(addActorModalBtnElement);

    const alertElement = await screen.findByText(/Adding actor failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid actor image url.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Invalid actor link url.' after add actor button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableActors />
        </NotificationsProvider>
      </BrowserRouter>
    );

    openAddActorModal();

    const addActorModalBtnElement = screen.getByRole("button", {
      name: "Add Actor",
    });
    typeIntoAddForm({
      fName: "Valid Actor",
      lName: "Name",
      age: 1,
      link: "invaliLink",
      imageUrl: "https://validimage.com",
    });
    userEvent.click(addActorModalBtnElement);

    const alertElement = await screen.findByText(/Adding actor failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid actor link url.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should close 'Add Actor' modal on 'X' button click", async () => {
    renderWithProviders(
      <BrowserRouter>
        <TableActors />
      </BrowserRouter>
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    const addActorBtnElement = screen.getByRole("button", {
      name: "Add Actor",
    });
    userEvent.click(addActorBtnElement);

    const addActorModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(addActorModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[0]); // Button X

    expect(addActorModalElement).not.toBeInTheDocument();
  });

  test("should render 'Update Actor' Modal if 'Add Actor' button is clicked", async () => {
    renderWithProviders(
      <BrowserRouter>
        <TableActors />
      </BrowserRouter>
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    openUpdateActorModal();
  });

  test("should render Keanu Reeves actor data in the modal after his update btn is clicked", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <TableActors />
      </BrowserRouter>
    );
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

    expect(fNameElement.value).toBe(keanu.firstName);
    expect(lNameElement.value).toBe(keanu.lastName);
    expect(ageElement.value).toBe(keanu.age.toString());
    expect(linkElement.value).toBe(keanu.link);
    expect(imageURLElement.value).toBe(keanu.image);
  });

  test("should alert 'Invalid first name.' after update actor button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableActors />
        </NotificationsProvider>
      </BrowserRouter>
    );
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
});

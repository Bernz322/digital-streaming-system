import {
  cleanup,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { TableUsers } from "..";
import { renderWithProviders } from "../../utils/test-utils";
import { mockUsers } from "../../utils/db.mocks";
import { NotificationsProvider } from "@mantine/notifications";

interface IForm {
  fName?: string;
  lName?: string;
  email?: string;
  password?: string;
}

const openAddUserModal = async () => {
  const addUserBtnElement = screen.getByRole("button", { name: "Add User" });
  expect(addUserBtnElement).toBeInTheDocument();
  userEvent.click(addUserBtnElement);

  const addUserModalElement = await screen.findByRole("dialog");
  await waitFor(() => {
    expect(addUserModalElement).toBeInTheDocument();
  });
};

const typeIntoForm = ({ fName, lName, email, password }: IForm) => {
  const fNameElement = screen.getByPlaceholderText("First Name");
  const lNameElement = screen.getByPlaceholderText("Last Name");
  const emailElement = screen.getByPlaceholderText("juandelacruz@gmail.com");
  const passwordElement = screen.getByPlaceholderText("password143");

  if (fName) {
    userEvent.type(fNameElement, fName);
  }
  if (lName) {
    userEvent.type(lNameElement, lName);
  }
  if (email) {
    userEvent.type(emailElement, email);
  }
  if (password) {
    userEvent.type(passwordElement, password);
  }
};

describe("Test Table Users Component", () => {
  afterEach(cleanup);

  test("should render all mocked users data", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <TableUsers />
      </BrowserRouter>
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const tableRows = screen.getAllByRole("row");

    // Extra one is from the table head row
    expect(tableRows.length - 1).toEqual(mockUsers.length);
    expect(store.getState().user.users.length).toEqual(mockUsers.length);
  });

  test("should render search input and 'Add User' button", async () => {
    renderWithProviders(
      <BrowserRouter>
        <TableUsers />
      </BrowserRouter>
    );

    const addUserBtnElement = screen.getByRole("button", { name: "Add User" });
    const searchUserInputElement =
      screen.getByPlaceholderText("Search user name");
    expect(addUserBtnElement).toBeInTheDocument();
    expect(searchUserInputElement).toBeInTheDocument();
  });

  test("should render 'john@doe.com' in table row after typing 'john'", async () => {
    renderWithProviders(
      <BrowserRouter>
        <TableUsers />
      </BrowserRouter>
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const searchUserInputElement =
      screen.getByPlaceholderText("Search user name");
    userEvent.type(searchUserInputElement, "john");

    await waitFor(() => expect(searchUserInputElement).toHaveValue("john"));
    const tableRows = screen.getAllByRole("row");

    expect(tableRows[1]).toHaveTextContent(/john@doe.com/i);
  });

  test("should render 'Add User' Modal if 'Add User' button is clicked", async () => {
    renderWithProviders(
      <BrowserRouter>
        <TableUsers />
      </BrowserRouter>
    );

    const addUserBtnElement = screen.getByRole("button", { name: "Add User" });
    expect(addUserBtnElement).toBeInTheDocument();
    userEvent.click(addUserBtnElement);

    // console.log(addUserBtnElement);

    const addUserModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(addUserModalElement).toBeInTheDocument();
    });
    expect(addUserModalElement).toHaveTextContent("Add User");
  });

  test("should alert 'Field first name is required.' after add user button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableUsers />
        </NotificationsProvider>
      </BrowserRouter>
    );

    openAddUserModal();

    const addUserModalBtnElement = screen.getByRole("button", {
      name: "Add User",
    });
    typeIntoForm({ fName: " " });
    userEvent.click(addUserModalBtnElement);

    const alertElement = await screen.findByText(/Adding user failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Field first name is required.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Invalid first name.' after add user button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableUsers />
        </NotificationsProvider>
      </BrowserRouter>
    );

    openAddUserModal();

    const addUserModalBtnElement = screen.getByRole("button", {
      name: "Add User",
    });

    typeIntoForm({ fName: "123" });
    userEvent.click(addUserModalBtnElement);

    const alertElement = await screen.findByText(/Adding user failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid first name.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Field last name is required.' after add user button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableUsers />
        </NotificationsProvider>
      </BrowserRouter>
    );

    openAddUserModal();

    const addUserModalBtnElement = screen.getByRole("button", {
      name: "Add User",
    });

    typeIntoForm({ fName: "Valid Name", lName: " " });
    userEvent.click(addUserModalBtnElement);

    const alertElement = await screen.findByText(/Adding user failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Field last name is required.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Invalid last name.' after add user button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableUsers />
        </NotificationsProvider>
      </BrowserRouter>
    );

    openAddUserModal();

    const addUserModalBtnElement = screen.getByRole("button", {
      name: "Add User",
    });

    typeIntoForm({ fName: "Valid Name", lName: "123" });
    userEvent.click(addUserModalBtnElement);

    const alertElement = await screen.findByText(/Adding user failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid last name.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Field email is required.' after add user button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableUsers />
        </NotificationsProvider>
      </BrowserRouter>
    );

    openAddUserModal();

    const addUserModalBtnElement = screen.getByRole("button", {
      name: "Add User",
    });

    typeIntoForm({ fName: "Valid FName", lName: "Valid LName", email: " " });
    userEvent.click(addUserModalBtnElement);

    const alertElement = await screen.findByText(/Adding user failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Field email is required.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Invalid email.' after add user button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableUsers />
        </NotificationsProvider>
      </BrowserRouter>
    );

    openAddUserModal();

    const addUserModalBtnElement = screen.getByRole("button", {
      name: "Add User",
    });

    typeIntoForm({
      fName: "Valid FName",
      lName: "Valid LName",
      email: "invalidemail",
    });
    userEvent.click(addUserModalBtnElement);

    const alertElement = await screen.findByText(/Adding user failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid email.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Field password is required.' after add user button is clicked in modal", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableUsers />
        </NotificationsProvider>
      </BrowserRouter>
    );

    openAddUserModal();

    const addUserModalBtnElement = screen.getByRole("button", {
      name: "Add User",
    });

    typeIntoForm({
      fName: "Valid FName",
      lName: "Valid LName",
      email: "valid@email.com",
      password: " ",
    });
    userEvent.click(addUserModalBtnElement);

    const alertElement = await screen.findByText(/Adding user failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Field password is required.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should render 'Update user' modal after 'John Doe' row is clicked", async () => {
    renderWithProviders(
      <BrowserRouter>
        <TableUsers />
      </BrowserRouter>
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const updateUserBtnElement = screen.getAllByTestId("rowUpdateUserBtn");
    await waitFor(() => {
      expect(updateUserBtnElement[1]).toBeInTheDocument();
    });
    userEvent.click(updateUserBtnElement[1]);

    const updateUserModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateUserModalElement).toBeInTheDocument();
    });
  });

  test("should render John Doe data in the modal after his row is clicked", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <TableUsers />
      </BrowserRouter>
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const mockedUsers = store.getState().user.users; // [0]->Admin / [1]->John
    const john = mockedUsers[1];

    const updateUserBtnElement = screen.getAllByTestId("rowUpdateUserBtn");
    await waitFor(() => {
      expect(updateUserBtnElement[1]).toBeInTheDocument();
    });
    userEvent.click(updateUserBtnElement[1]);

    const updateUserModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateUserModalElement).toBeInTheDocument();
    });

    const fNameElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "First Name",
    });
    const lNameElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Last Name",
    });
    const emailElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Email",
    });
    expect(fNameElement.value).toBe(john.firstName);
    expect(lNameElement.value).toBe(john.lastName);
    expect(emailElement.value).toBe(john.email);
  });

  test("should render delete user modal after 'John Doe' row is clicked", async () => {
    renderWithProviders(
      <BrowserRouter>
        <TableUsers />
      </BrowserRouter>
    );
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const deleteUserBtnElement = screen.getAllByTestId("rowDeleteUserBtn");
    await waitFor(() => {
      expect(deleteUserBtnElement[1]).toBeInTheDocument();
    });
    userEvent.click(deleteUserBtnElement[1]);

    const deleteUserModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(deleteUserModalElement).toBeInTheDocument();
    });
    expect(deleteUserModalElement).toHaveTextContent(
      "Are you sure to delete this account?This cannot be undone"
    );
  });
});

/* eslint-disable testing-library/no-render-in-setup */
import {
  cleanup,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { NotificationsProvider } from "@mantine/notifications";
import { TableUsers } from "../../components";
import { renderWithProviders } from "../../utils/test-utils";
import { mockUsers } from "../../utils/db.mocks";

interface IForm {
  fName?: string;
  lName?: string;
  email?: string;
  passValue?: string;
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

const openUpdateUserModal = async () => {
  const updateUserBtnElement = screen.getAllByTestId("rowUpdateUserBtn");
  await waitFor(() => {
    expect(updateUserBtnElement[1]).toBeInTheDocument();
  });
  userEvent.click(updateUserBtnElement[1]);

  const updateUserModalElement = await screen.findByRole("dialog");
  await waitFor(() => {
    expect(updateUserModalElement).toBeInTheDocument();
  });
};

const typeIntoForm = ({ fName, lName, email, passValue }: IForm) => {
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
  if (passValue) {
    userEvent.type(passwordElement, passValue);
  }
};

describe("<TableUsers />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <TableUsers />
        </NotificationsProvider>
      </BrowserRouter>
    );
  };
  afterEach(cleanup);

  test("should render all mocked users data", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    const tableRows = screen.getAllByRole("row");
    // Extra one is from the table head row
    expect(tableRows.length - 1).toEqual(mockUsers.length);
    expect(store.getState().user.users.length).toEqual(mockUsers.length);
  });

  test("should render search input and 'Add User' button", async () => {
    renderApp();
    const addUserBtnElement = screen.getByRole("button", { name: "Add User" });
    const searchUserInputElement =
      screen.getByPlaceholderText("Search user name");
    expect(addUserBtnElement).toBeInTheDocument();
    expect(searchUserInputElement).toBeInTheDocument();
  });

  test("should render 'john@doe.com' in table row after searching 'john'", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    const searchUserInputElement =
      screen.getByPlaceholderText("Search user name");
    userEvent.type(searchUserInputElement, "john");
    await waitFor(() => expect(searchUserInputElement).toHaveValue("john"));
    const tableRows = screen.getAllByRole("row");
    expect(tableRows[1]).toHaveTextContent(/john@doe.com/i);
  });

  test("should render 'Add User' Modal if 'Add User' button is clicked", async () => {
    renderApp();
    const addUserBtnElement = screen.getByRole("button", {
      name: "Add User",
    });
    expect(addUserBtnElement).toBeInTheDocument();
    userEvent.click(addUserBtnElement);

    const addUserModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(addUserModalElement).toBeInTheDocument();
    });
    expect(addUserModalElement).toHaveTextContent("Add User");
  });

  describe("Add User Modal input field validations", () => {
    beforeEach(() => {
      renderApp();
      openAddUserModal();
    });

    test("should render 'Field first name is required.' alert if Add btn is clicked", async () => {
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

    test("should render 'Field last name is required.' alert if Add btn is clicked", async () => {
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

    test("should render 'Field email is required.' alert if Add btn is clicked", async () => {
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

    test("should render 'Field password is required.' alert if Add btn is clicked", async () => {
      const addUserModalBtnElement = screen.getByRole("button", {
        name: "Add User",
      });
      typeIntoForm({
        fName: "Valid FName",
        lName: "Valid LName",
        email: "valid@email.com",
        passValue: " ",
      });
      userEvent.click(addUserModalBtnElement);
      const alertElement = await screen.findByText(/Adding user failed./);
      await waitFor(() => {
        expect(alertElement).toBeInTheDocument();
      });
      const alertMessage = screen.getByText("Field password is required.");
      expect(alertMessage).toBeInTheDocument();
    });
  });

  test("should close 'Add user' modal on 'X' button click", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const addUserBtnElement = screen.getByRole("button", {
      name: "Add User",
    });
    expect(addUserBtnElement).toBeInTheDocument();
    userEvent.click(addUserBtnElement);

    const addUserModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(addUserModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[0]); // Button X

    expect(addUserModalElement).not.toBeInTheDocument();
  });

  test("should render 'Update user' modal after 'John Doe' row is clicked", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    openUpdateUserModal();
  });

  test("should render John Doe data in the modal after his update btn is clicked", async () => {
    const { store } = renderApp();
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

  test("should alert 'Invalid first name'", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open modal
    const updateUserBtnElement = screen.getAllByTestId("rowUpdateUserBtn");
    // Select John
    await waitFor(() => {
      expect(updateUserBtnElement[1]).toBeInTheDocument();
    });
    userEvent.click(updateUserBtnElement[1]);

    const updateUserModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateUserModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const fNameElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "First Name",
    });
    const updateUserModalBtnElement = screen.getAllByRole("button")[1];

    // Type invalid name
    userEvent.type(fNameElement, "123");

    userEvent.click(updateUserModalBtnElement);

    // Alert will pop up
    const alertElement = await screen.findByText(/Updating user failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid first name.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Invalid last name'", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open modal
    const updateUserBtnElement = screen.getAllByTestId("rowUpdateUserBtn");
    await waitFor(() => {
      expect(updateUserBtnElement[1]).toBeInTheDocument();
    });
    userEvent.click(updateUserBtnElement[1]);

    const updateUserModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateUserModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const lNameElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Last Name",
    });
    const updateUserModalBtnElement = screen.getAllByRole("button")[1];

    // Type invalid name
    userEvent.type(lNameElement, "123");

    userEvent.click(updateUserModalBtnElement);

    // Alert will pop up
    const alertElement = await screen.findByText(/Updating user failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Invalid last name.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should alert 'Field email is required", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open modal
    const updateUserBtnElement = screen.getAllByTestId("rowUpdateUserBtn");
    await waitFor(() => {
      expect(updateUserBtnElement[1]).toBeInTheDocument();
    });
    userEvent.click(updateUserBtnElement[1]);

    const updateUserModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateUserModalElement).toBeInTheDocument();
    });

    // Opened Modal
    const emailElement: HTMLInputElement = screen.getByRole("textbox", {
      name: "Email",
    });
    const updateUserModalBtnElement = screen.getAllByRole("button")[1];

    // Clear input field (it contains John's email)
    emailElement.setSelectionRange(0, emailElement.value.length);

    // Type space
    userEvent.type(emailElement, " ");

    userEvent.click(updateUserModalBtnElement);

    // Alert will pop up
    const alertElement = await screen.findByText(/Updating user failed./);
    await waitFor(() => {
      expect(alertElement).toBeInTheDocument();
    });

    const alertMessage = screen.getByText("Field email is required.");
    expect(alertMessage).toBeInTheDocument();
  });

  test("should close 'Update user' modal on 'X' button click", async () => {
    renderApp();
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

    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[0]); // Button X

    expect(updateUserModalElement).not.toBeInTheDocument();
  });

  test("should change John's account status and role on radio btn click inside update modal", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const updateUserBtnElement = screen.getAllByTestId("rowUpdateUserBtn");
    await waitFor(() => {
      expect(updateUserBtnElement[1]).toBeInTheDocument();
    });
    userEvent.click(updateUserBtnElement[1]);

    // User John data
    const updateUserModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(updateUserModalElement).toBeInTheDocument();
    });

    const deactivateRadioBtnElement: HTMLInputElement = screen.getByRole(
      "radio",
      {
        name: "Deactivate",
      }
    );
    const adminRadioBtnElement: HTMLInputElement = screen.getByRole("radio", {
      name: "Admin",
    });
    userEvent.click(deactivateRadioBtnElement);
    userEvent.click(adminRadioBtnElement);

    expect(deactivateRadioBtnElement.value).toBe("false");
    expect(adminRadioBtnElement.value).toBe("admin");
  });

  test("should render delete user modal after 'John Doe' row is clicked", async () => {
    renderApp();
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

  test("should close delete user modal on 'X' button click", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open delete user modal
    const deleteUserBtnElement = screen.getAllByTestId("rowDeleteUserBtn");
    await waitFor(() => {
      expect(deleteUserBtnElement[1]).toBeInTheDocument();
    });
    userEvent.click(deleteUserBtnElement[1]);

    const deleteUserModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(deleteUserModalElement).toBeInTheDocument();
    });

    // Opened delete user modal
    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[0]); // Button X

    expect(deleteUserModalElement).not.toBeInTheDocument();
  });

  test("should close delete user modal on 'No' button click", async () => {
    renderApp();
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

    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[2]); // Button with No text

    expect(deleteUserModalElement).not.toBeInTheDocument();
  });

  test("should delete user 'John' on 'Yes' button click", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    // Open Modal
    const deleteUserBtnElement = screen.getAllByTestId("rowDeleteUserBtn");
    await waitFor(() => {
      expect(deleteUserBtnElement[1]).toBeInTheDocument();
    });
    userEvent.click(deleteUserBtnElement[1]);

    // Opened Modal
    const deleteUserModalElement = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(deleteUserModalElement).toBeInTheDocument();
    });

    const closeModalBtnElement = screen.getAllByRole("button");
    userEvent.click(closeModalBtnElement[1]); // Button with Yes text

    expect(deleteUserModalElement).not.toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    // Initially, store user state has 2 users, admin and john, after deletion of john, admin will remain.
    expect(store.getState().user.users.length).toBe(1);
  });
});

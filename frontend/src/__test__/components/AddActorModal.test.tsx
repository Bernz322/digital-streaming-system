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
import { TableActors } from "../../components";
import renderWithProviders from "../../utils/test-utils";

interface IForm {
  fName?: string;
  lName?: string;
  age?: string;
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

describe("<AddActorModal />", () => {
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

  test("should render 'Add Actor' Modal if 'Add Actor' button is clicked", async () => {
    renderApp();
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

  test("should select female on radio btn click", async () => {
    renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    openAddActorModal();

    const femaleRadioBtnElement: HTMLInputElement = screen.getByRole("radio", {
      name: "Female",
    });
    userEvent.click(femaleRadioBtnElement);
    expect(femaleRadioBtnElement.value).toBe("female");
  });

  describe("Render different alert messages for failed validations", () => {
    beforeEach(() => {
      renderApp();
      openAddActorModal();
    });
    test("should render alert 'Field first name is required.'", async () => {
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

    test("should render alert 'Invalid last name.'", async () => {
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

    test("should render alert 'Actor age cannot be less than a year.'", async () => {
      const addActorModalBtnElement = screen.getByRole("button", {
        name: "Add Actor",
      });
      typeIntoAddForm({ fName: "Valid Actor", lName: "Name", age: "-1" });
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

    test("should render alert 'Invalid actor image url.'", async () => {
      const addActorModalBtnElement = screen.getByRole("button", {
        name: "Add Actor",
      });
      typeIntoAddForm({
        fName: "Valid Actor",
        lName: "Name",
        age: "12",
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

    test("should render alert 'Invalid actor link url.'", async () => {
      const addActorModalBtnElement = screen.getByRole("button", {
        name: "Add Actor",
      });
      typeIntoAddForm({
        fName: "Valid Actor",
        lName: "Name",
        age: "12",
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
  });

  test("should close 'Add Actor' modal on 'X' button click", async () => {
    renderApp();
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
});

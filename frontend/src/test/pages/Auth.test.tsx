import { cleanup, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { NotificationsProvider } from "@mantine/notifications";
import { renderWithProviders } from "../../utils/test-utils";
import { Auth } from "../../pages";
import { server } from "../../mocks/server";
import { baseAPIUrl } from "../../utils/apiCalls";

interface IRegisterForm {
  fName?: string;
  lName?: string;
  email?: string;
  passValue?: string;
}
interface ILoginForm {
  email?: string;
  passValue?: string;
}

const typeIntoRegisterForm = ({
  fName,
  lName,
  email,
  passValue,
}: IRegisterForm) => {
  const fNameInputElement = screen.getByRole("textbox", {
    name: "First name",
  });
  const lNameInputElement = screen.getByRole("textbox", {
    name: "Last name",
  });
  const emailInputElement = screen.getByRole("textbox", { name: "Email" });
  const passwordInputElement: HTMLInputElement =
    screen.getByPlaceholderText("Your password");

  if (fName) {
    userEvent.type(fNameInputElement, fName);
  }
  if (lName) {
    userEvent.type(lNameInputElement, lName);
  }
  if (email) {
    userEvent.type(emailInputElement, email);
  }
  if (passValue) {
    userEvent.type(passwordInputElement, passValue);
  }
};

const typeIntoLoginForm = ({ email, passValue }: ILoginForm) => {
  const emailInputElement = screen.getByRole("textbox", { name: "Email" });
  const passwordInputElement: HTMLInputElement =
    screen.getByPlaceholderText("Your password");
  if (email) {
    userEvent.type(emailInputElement, email);
  }
  if (passValue) {
    userEvent.type(passwordInputElement, passValue);
  }
};

const switchForms = () => {
  const switchFormElement = screen.getAllByRole("button")[0];
  userEvent.click(switchFormElement);
};

describe("<Auth />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <Auth />
        </NotificationsProvider>
      </BrowserRouter>
    );
  };
  afterEach(() => cleanup);

  test("should render 'Field email is required.' alert after login", async () => {
    renderApp();

    const loginButtonElement = screen.getByText("Login");
    typeIntoLoginForm({ email: " " });
    userEvent.click(loginButtonElement);

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/Field email is required/i);
  });

  test("should render 'Invalid email.' alert after login", async () => {
    renderApp();

    const loginButtonElement = screen.getByText("Login");
    typeIntoLoginForm({ email: "invalidemail" });
    userEvent.click(loginButtonElement);

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/Invalid email/i);
  });

  test("should be able to type password", async () => {
    renderApp();

    const passwordInputElement: HTMLInputElement =
      screen.getByPlaceholderText("Your password");

    userEvent.type(passwordInputElement, "mySecretPassword");

    expect(passwordInputElement.value).toBe("mySecretPassword");
  });

  test("should render 'Wrong Credentials' alert after login", async () => {
    server.use(
      rest.post(`${baseAPIUrl}/users/login`, (req, res, ctx) => {
        return res(
          ctx.json({
            status: "fail",
            data: null,
            message: "Wrong credentials.",
          }),
          ctx.delay(150)
        );
      })
    );
    renderApp();

    const loginButtonElement = screen.getAllByRole("button");
    const loginButtonSpan = screen.getByText(/Login/i);
    // Mocked user credential is email: admin@root.com | password:admin
    typeIntoLoginForm({ email: "admin@wrong.com", passValue: "wrongPassword" });

    userEvent.click(loginButtonElement[1]);

    await waitFor(() => expect(loginButtonSpan).toBeInTheDocument());

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/Wrong credentials/i);
  });

  test("should render register form after link click", () => {
    renderApp();

    switchForms();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test("should render 'Field first name is required.' alert", async () => {
    renderApp();

    // Switch forms (Login -> Register)
    switchForms();

    // Render register form
    const registerButtonElement = screen.getAllByRole("button")[1];
    typeIntoRegisterForm({ fName: " " });
    userEvent.click(registerButtonElement);

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/first name is required/i);
  });

  test("should render 'Field last name is required.' alert", async () => {
    renderApp();

    // Switch forms (Login -> Register)
    switchForms();

    // Render register form
    const registerButtonElement = screen.getAllByRole("button")[1];

    typeIntoRegisterForm({ fName: "Valid", lName: " " });
    userEvent.click(registerButtonElement);

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/last name is required/i);
  });

  test("should render 'Email is already taken' alert after register", async () => {
    server.use(
      rest.post(`${baseAPIUrl}/users/register`, (req, res, ctx) => {
        return res(
          ctx.json({
            status: "fail",
            data: null,
            message: "Email is already taken.",
          }),
          ctx.delay(150)
        );
      })
    );
    renderApp();

    // Switch forms (Login -> Register)
    switchForms();

    // Render register form
    const registerButtonElement = screen.getAllByRole("button")[1];
    const registerButtonSpan = screen.getByText(/Register/i);

    typeIntoRegisterForm({
      fName: "Email",
      lName: "Taken",
      email: "taken@doe.com",
      passValue: "secret",
    });

    userEvent.click(registerButtonElement);

    await waitFor(() => expect(registerButtonSpan).toBeInTheDocument());

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/Email is already taken/i);
  });

  test("should render 'Please wait for your account activation' alert after success registration", async () => {
    renderApp();

    // Switch forms (Login -> Register)
    switchForms();

    // Render register form
    const registerButtonElement = screen.getAllByRole("button")[1];
    const registerButtonSpan = screen.getByText(/Register/i);

    typeIntoRegisterForm({
      fName: "John",
      lName: "Doe",
      email: "john@doe.com",
      passValue: "secret",
    });

    userEvent.click(registerButtonElement);

    await waitFor(() => expect(registerButtonSpan).toBeInTheDocument());

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(
      /Please wait for your account activation/i
    );
  });
});

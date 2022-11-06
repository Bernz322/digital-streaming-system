import { cleanup, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { renderWithProviders } from "../utils/test-utils";
import { Auth } from ".";
import { NotificationsProvider } from "@mantine/notifications";
import { server } from "../mocks/server";
import { baseAPIUrl } from "../utils/apiCalls";

describe("Test Auth Page", () => {
  afterEach(() => cleanup);

  test("should render 'Field email is required.' alert", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <Auth />
        </NotificationsProvider>
      </BrowserRouter>
    );

    const loginButtonElement = screen.getByText("Login");
    const emailInputElement = screen.getByRole("textbox", { name: "Email" });

    userEvent.type(emailInputElement, " ");
    userEvent.click(loginButtonElement);

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/Field email is required/i);
  });

  test("should render 'Invalid email.' alert", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <Auth />
        </NotificationsProvider>
      </BrowserRouter>
    );

    const loginButtonElement = screen.getByText("Login");
    const emailInputElement = screen.getByRole("textbox", { name: "Email" });

    userEvent.type(emailInputElement, "invalidemail");
    userEvent.click(loginButtonElement);

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/Invalid email/i);
  });

  test("should be able to type password", async () => {
    renderWithProviders(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
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
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <Auth />
        </NotificationsProvider>
      </BrowserRouter>
    );

    const emailInputElement = screen.getByRole("textbox", { name: "Email" });
    const passwordInputElement: HTMLInputElement =
      screen.getByPlaceholderText("Your password");
    const loginButtonElement = screen.getAllByRole("button");
    const loginButtonSpan = screen.getByText(/Login/i);

    userEvent.type(emailInputElement, "admin@wrong.com");
    userEvent.type(passwordInputElement, "wrongPassword");
    userEvent.click(loginButtonElement[1]);

    await waitFor(() => expect(loginButtonSpan).toBeInTheDocument());

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/Wrong credentials/i);
  });

  //   test("should go to '/' route after successful login", async () => {
  //     renderWithProviders(
  //       <BrowserRouter>
  //         <NotificationsProvider>
  //           <Auth />
  //         </NotificationsProvider>
  //       </BrowserRouter>
  //     );

  //     const emailInputElement = screen.getByRole("textbox", { name: "Email" });
  //     const passwordInputElement: HTMLInputElement =
  //       screen.getByPlaceholderText("Your password");
  //     const loginButtonElement = screen.getAllByRole("button")[1];

  //     userEvent.type(emailInputElement, "new@user.com");
  //     userEvent.type(passwordInputElement, "secretPassword");
  //     userEvent.click(loginButtonElement);
  //     console.log(window.location.pathname);
  //     expect(window.location.pathname).toBe("/");
  //   });

  test("should render register form after link click", () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <Auth />
        </NotificationsProvider>
      </BrowserRouter>
    );

    const switchFormElement = screen.getAllByRole("button");
    userEvent.click(switchFormElement[0]);

    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test("should render 'Field first name is required.' alert", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <Auth />
        </NotificationsProvider>
      </BrowserRouter>
    );
    // Switch form
    const switchFormElement = screen.getAllByRole("button")[0];
    userEvent.click(switchFormElement);

    // Rendered register form
    const fNameInputElement = screen.getByRole("textbox", {
      name: "First name",
    });
    const registerButtonElement = screen.getAllByRole("button")[1];

    userEvent.type(fNameInputElement, " ");
    userEvent.click(registerButtonElement);

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/first name is required/i);
  });

  test("should render 'Field last name is required.' alert", async () => {
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <Auth />
        </NotificationsProvider>
      </BrowserRouter>
    );
    // Switch form
    const switchFormElement = screen.getAllByRole("button")[0];
    userEvent.click(switchFormElement);

    // Rendered register form
    const lNameInputElement = screen.getByRole("textbox", {
      name: "Last name",
    });
    const registerButtonElement = screen.getAllByRole("button")[1];

    userEvent.type(lNameInputElement, " ");
    userEvent.click(registerButtonElement);

    const alertMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alertMessage).toBeInTheDocument();
    });
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/first name is required/i);
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
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <Auth />
        </NotificationsProvider>
      </BrowserRouter>
    );
    // Switch form
    const switchFormElement = screen.getAllByRole("button")[0];
    userEvent.click(switchFormElement);

    // Rendered register form
    const fNameInputElement = screen.getByRole("textbox", {
      name: "First name",
    });
    const lNameInputElement = screen.getByRole("textbox", {
      name: "Last name",
    });
    const emailInputElement = screen.getByRole("textbox", { name: "Email" });
    const passwordInputElement: HTMLInputElement =
      screen.getByPlaceholderText("Your password");
    const registerButtonElement = screen.getAllByRole("button")[1];
    const registerButtonSpan = screen.getByText(/Register/i);

    userEvent.type(fNameInputElement, "Email");
    userEvent.type(lNameInputElement, "Taken");
    userEvent.type(emailInputElement, "email@isTaken.com");
    userEvent.type(passwordInputElement, "secretPassword");
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
    renderWithProviders(
      <BrowserRouter>
        <NotificationsProvider>
          <Auth />
        </NotificationsProvider>
      </BrowserRouter>
    );
    // Switch form
    const switchFormElement = screen.getAllByRole("button")[0];
    userEvent.click(switchFormElement);

    // Rendered register form
    const fNameInputElement = screen.getByRole("textbox", {
      name: "First name",
    });
    const lNameInputElement = screen.getByRole("textbox", {
      name: "Last name",
    });
    const emailInputElement = screen.getByRole("textbox", { name: "Email" });
    const passwordInputElement: HTMLInputElement =
      screen.getByPlaceholderText("Your password");
    const registerButtonElement = screen.getAllByRole("button")[1];
    const registerButtonSpan = screen.getByText(/Register/i);

    userEvent.type(fNameInputElement, "New Valid");
    userEvent.type(lNameInputElement, "User");
    userEvent.type(emailInputElement, "new@user.com");
    userEvent.type(passwordInputElement, "secretPassword");
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

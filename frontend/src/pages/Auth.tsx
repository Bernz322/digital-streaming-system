import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Button,
  Anchor,
  Group,
  Loader,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Container,
} from "@mantine/core";
import { useToggle, upperFirst } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  isLoggedIn,
  isNotEmpty,
  isValidEmail,
  isValidName,
} from "../utils/helpers";
import { authLogin, authRegister } from "../features/auth/authSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";
import { IRegisterAPIProps, IDispatchResponse } from "../utils/types";
import { useAuthPageStyles } from "../styles/AuthPageStyles";
export interface IRegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
const Auth = () => {
  const { classes } = useAuthPageStyles();
  const { isLoading } = useTypedSelector((state) => state.auth);
  const dispatch = useTypedDispatch();
  const [formValues, setFormValues] = useState<IRegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  } as IRegisterForm);

  const [type, toggle] = useToggle(["login", "register"]);

  // Submit either the registration action or login action
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "register") {
      try {
        // Validate input fields
        isValidName(formValues.firstName, "first");
        isValidName(formValues.lastName, "last");
        isValidEmail(formValues.email);
        isNotEmpty(formValues.password, "password");

        const userData: IRegisterAPIProps = {
          firstName: formValues.firstName.trim(),
          lastName: formValues.lastName.trim(),
          email: formValues.email.trim(),
          password: formValues.password.trim(),
        };

        const res: IDispatchResponse = await dispatch(authRegister(userData));
        if (!res.error) {
          setFormValues({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          });
        }
      } catch (error: any) {
        showNotification({
          title: "Registration failed. See message below for more info.",
          message: error.message,
          autoClose: 3000,
          color: "yellow",
        });
      }
    } else {
      try {
        // Validate input fields
        isValidEmail(formValues.email);
        isNotEmpty(formValues.password, "password");

        await dispatch(
          authLogin({
            email: formValues.email.trim(),
            password: formValues.password.trim(),
          })
        );
      } catch (error: any) {
        showNotification({
          title: "Login failed. See message below for more info",
          message: error.message,
          autoClose: 3000,
          color: "yellow",
        });
      }
    }
  };

  // Check if user is already logged in. If yes, then make Auth Page inaccessable.
  if (isLoggedIn()) return <Navigate to="/" />;

  return (
    <Paper radius="md" p="xl" className={classes.paper}>
      <Container size={500} my={40} className={classes.container}>
        <Text size="lg" weight={500} className={classes.title}>
          Welcome to ratebox
        </Text>
        <form onSubmit={handleSubmit}>
          <Stack>
            {type === "register" && (
              <TextInput
                label="First name"
                placeholder="Your first name"
                value={formValues?.firstName}
                onChange={(event) =>
                  setFormValues({
                    ...formValues,
                    firstName: event.currentTarget.value,
                  })
                }
                withAsterisk
              />
            )}

            {type === "register" && (
              <TextInput
                label="Last name"
                placeholder="Your last name"
                value={formValues?.lastName}
                onChange={(event) =>
                  setFormValues({
                    ...formValues,
                    lastName: event.currentTarget.value,
                  })
                }
                withAsterisk
              />
            )}

            <TextInput
              label="Email"
              placeholder="hello@mantine.dev"
              value={formValues?.email}
              onChange={(event) =>
                setFormValues({
                  ...formValues,
                  email: event.currentTarget.value,
                })
              }
              withAsterisk
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={formValues?.password}
              onChange={(event) =>
                setFormValues({
                  ...formValues,
                  password: event.currentTarget.value,
                })
              }
              withAsterisk
            />
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="blue"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader color="white" size="sm" />
              ) : (
                upperFirst(type)
              )}
            </Button>
          </Group>
        </form>
      </Container>
    </Paper>
  );
};

export default Auth;

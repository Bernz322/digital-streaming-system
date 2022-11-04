import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Button,
  Anchor,
  createStyles,
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
import { isLoggedIn, isValidEmail, isValidName } from "../utils/helpers";
import { authLogin, authRegister } from "../features/auth/authSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";
import { IRegisterAPIProps, IDispatchResponse } from "../utils/types";

const useStyles = createStyles((theme) => ({
  paper: {
    backgroundColor: "#282828",
    minHeight: "100vh",
    paddingTop: 500,
    paddingBottom: 105,
    paddingLeft: 15,
    paddingRight: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#181818",
    borderRadius: 15,
    padding: "50px 35px",
    width: "600px",
  },
  title: {
    color: theme.colors.blue[5],
  },
}));

export interface IRegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const Auth = () => {
  const { classes } = useStyles();
  const { isLoading } = useTypedSelector((state) => state.auth);
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<IRegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  } as IRegisterForm);

  const [type, toggle] = useToggle(["login", "register"]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "register") {
      try {
        isValidName(formValues.firstName, "first");
        isValidName(formValues.lastName, "last");
        isValidEmail(formValues.email);
        if (formValues.password === "" || !formValues.password)
          throw new Error("Field password is required.");

        const userData: IRegisterAPIProps = {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          password: formValues.password,
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
        isValidEmail(formValues.email);
        if (formValues.password === "" || !formValues.password)
          throw new Error("Field password is required.");

        const res: IDispatchResponse = await dispatch(
          authLogin({ email: formValues.email, password: formValues.password })
        );
        if (!res.error) {
          navigate("/", { replace: true });
        }
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

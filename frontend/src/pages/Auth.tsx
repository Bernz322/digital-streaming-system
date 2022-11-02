import { useCallback } from "react";
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
import { useForm } from "@mantine/form";
import { isValidEmail, isValidName } from "../utils/helpers";

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

const Auth = () => {
  const { classes } = useStyles();

  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },

    validate: {
      email: (val) => (isValidEmail(val) ? null : "Please enter a valid email"),
      firstName: (val) =>
        isValidName(val) ? null : "Please enter a valid first name",
      lastName: (val) =>
        isValidName(val) ? null : "Please enter a valid last name",
      password: (val) =>
        val.length <= 1 ? "Please enter a longer password" : null,
    },
  });

  const handleSubmit = useCallback(async () => {
    if (type === "register") {
      const userData = {
        firstName: form.values.firstName,
        lastName: form.values.lastName,
        email: form.values.email,
        password: form.values.password,
      };
      console.log(userData);
      // dispatch(register(userData))
    } else {
      const userData = {
        email: form.values.email,
        password: form.values.password,
      };
      console.log(userData);
      // dispatch(login(userData))
    }
  }, [
    form.values.firstName,
    form.values.email,
    form.values.lastName,
    form.values.password,
    type,
  ]);

  return (
    <Paper radius="md" p="xl" className={classes.paper}>
      <Container size={500} my={40} className={classes.container}>
        <Text size="lg" weight={500} className={classes.title}>
          Welcome to ratebox
        </Text>

        <form onSubmit={form.onSubmit(() => handleSubmit())}>
          <Stack>
            {type === "register" && (
              <TextInput
                label="First name"
                placeholder="Your first name"
                value={form.values.firstName}
                onChange={(event) =>
                  form.setFieldValue("firstName", event.currentTarget.value)
                }
                error={
                  form.errors.firstName && "Please enter a valid first name"
                }
              />
            )}

            {type === "register" && (
              <TextInput
                label="Last name"
                placeholder="Your last name"
                value={form.values.lastName}
                onChange={(event) =>
                  form.setFieldValue("lastName", event.currentTarget.value)
                }
                error={form.errors.lastName && "Please enter a valid last name"}
              />
            )}

            <TextInput
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Please enter a valid email"}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={form.errors.password && "Please enter a longer password"}
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
            <Button type="submit" disabled={false}>
              {false ? <Loader color="white" size="sm" /> : upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Container>
    </Paper>
  );
};

export default Auth;

import {
  Button,
  Container,
  createStyles,
  Group,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colors.red[8],
  },

  title: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 38,
    color: theme.colors.blue[5],
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },

  paper: {
    backgroundColor: "#121212",
    minHeight: "100vh",
    paddingTop: "95px",
  },
}));

const Page404 = () => {
  const { classes } = useStyles();
  let navigate = useNavigate();
  return (
    <Paper radius={0} className={classes.paper}>
      <Container className={classes.root}>
        <div className={classes.label}>404</div>
        <Title className={classes.title}>You have found a secret place.</Title>
        <Text
          color="dimmed"
          size="lg"
          align="center"
          className={classes.description}
        >
          Unfortunately, this is only a 404 page. You may have mistyped the
          address, or the page has been moved to another URL.
        </Text>
        <Group position="center">
          <Button color="blue" size="lg" onClick={() => navigate("/")}>
            Take me back to home page
          </Button>
        </Group>
      </Container>
    </Paper>
  );
};

export default Page404;

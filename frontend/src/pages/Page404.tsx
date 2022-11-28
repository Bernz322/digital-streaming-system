import { Button, Container, Group, Paper, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { usePage404Styles } from "../styles/Page404Styles";

function Page404() {
  const { classes } = usePage404Styles();
  const navigate = useNavigate();
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
}

export default Page404;

import { createStyles } from "@mantine/core";

export const usePage404Styles = createStyles((theme) => ({
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
    minHeight: 100,
    paddingTop: 95,
  },
}));

import { createStyles } from "@mantine/core";

/**
 * The page 404 styles based on createStyles of MantineUI
 * MantineUI supports theming (dark/ light) based on the MantineProvider 'theme' prop wrapper inside the App.tsx
 * As the entire app is in dark theme, the theme prop is set to dark.
 * @param {theme} theme - the theme of all mantine components to be used. (Dark)
 */
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

import { createStyles } from "@mantine/core";

/**
 * The page Auth styles based on createStyles of MantineUI
 * MantineUI supports theming (dark/ light) based on the MantineProvider 'theme' prop wrapper inside the App.tsx
 * As the entire app is in dark theme, the theme prop is set to dark.
 * @param {theme} theme - the theme of all mantine components to be used. (Dark)
 */
export const useAuthPageStyles = createStyles((theme) => ({
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

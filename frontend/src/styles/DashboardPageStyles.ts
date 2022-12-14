import { createStyles } from "@mantine/core";

/**
 * The page Dashboard styles based on createStyles of MantineUI
 * MantineUI supports theming (dark/ light) based on the MantineProvider theme props wrapper inside the App.tsx
 * As the entire app is in dark theme, the theme prop is set to dark.
 * @param {theme} theme - the theme of all mantine components to be used. (Dark)
 */
export const useDashboardPageStyles = createStyles((theme) => ({
  main: {
    background: "#121212",
    padding: 0,
    paddingTop: 70,
  },
  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none !important",
    fontSize: theme.fontSizes.sm,
    color: theme.colors.gray[3],
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colors.dark[5],
      color: theme.colors.blue[5],
    },
  },

  linkIcon: {
    color: theme.colors.gray[3],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.colors.blue[5],
      color: theme.colors.gray[9],
    },
  },
  left: {
    display: "none",
    [theme.fn.smallerThan("xs")]: {
      display: "flex",
      justifyContent: "flex-end",
    },
  },
  navBar: {
    padding: 25,
    width: 300,
    zIndex: 5,
    backgroundColor: "#121212",
  },
  container: {
    minWidth: "100%",
  },
}));

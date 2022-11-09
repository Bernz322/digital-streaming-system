import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  paper: {
    borderRadius: 15,
    backgroundColor: "#424242",
    padding: 25,
    marginTop: 25,
  },
  root: {
    position: "relative",
  },

  label: {
    position: "absolute",
    zIndex: 2,
    top: 7,
    left: theme.spacing.sm,
    pointerEvents: "none",
  },

  required: {
    transition: "opacity 150ms ease",
  },

  input: {
    "&::placeholder": {
      transition: "color 150ms ease",
    },
    width: 200,
  },
  head: {
    [theme.fn.smallerThan("xs")]: {
      justifyContent: "center",
    },
  },
  btn: {
    width: "100%",
    flex: 6,
  },
  txt: {
    minWidth: "fit-content",
    maxWidth: 180,
    color: "white",
  },
}));

export const tableCustomStyles = {
  rows: {
    style: {
      padding: "5px 0",
    },
  },
  table: {
    style: {
      minHeight: "400px",
    },
  },
};

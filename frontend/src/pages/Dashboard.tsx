import { AppShell, createStyles, Navbar } from "@mantine/core";
import {
  TableActors,
  TableMovies,
  TableReviews,
  TableUsers,
} from "../components";
import {
  IconLayoutDashboard,
  IconUser,
  IconMovie,
  IconUsers,
} from "@tabler/icons";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  main: {
    background: "#121212",
    padding: 0,
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
}));

const Dashboard = () => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Dashboard");
  const navItems = [
    { link: "", label: "Dashboard", icon: IconLayoutDashboard },
    { link: "", label: "Users", icon: IconUser },
    { link: "", label: "Actors", icon: IconUsers },
    { link: "", label: "Movies", icon: IconMovie },
  ];
  return (
    <AppShell
      className={classes.main}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar hiddenBreakpoint="sm" className={classes.navBar}>
          <Navbar.Section grow mt="95px">
            {navItems.map((item) => (
              <a
                className={cx(classes.link, {
                  [classes.linkActive]: item.label === active,
                })}
                href={item.link}
                key={item.label}
                onClick={(event) => {
                  event.preventDefault();
                  setActive(item.label);
                }}
              >
                <item.icon
                  className={cx(classes.linkIcon, {
                    [classes.linkActive]: item.label === active,
                  })}
                />
                <span>{item.label}</span>
              </a>
            ))}
          </Navbar.Section>
        </Navbar>
      }
    >
      <main className="pageContainer">
        {(active === "Users" || active === "Dashboard") && <TableUsers />}
        {(active === "Actors" || active === "Dashboard") && <TableActors />}
        {(active === "Movies" || active === "Dashboard") && (
          <>
            <TableMovies /> <TableReviews />
          </>
        )}
      </main>
    </AppShell>
  );
};

export default Dashboard;

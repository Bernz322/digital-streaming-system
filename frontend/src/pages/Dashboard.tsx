import { useState } from "react";
import { AppShell, Container, Navbar } from "@mantine/core";
import {
  IconLayoutDashboard,
  IconUser,
  IconMovie,
  IconUsers,
} from "@tabler/icons";
import {
  TableActors,
  TableMovies,
  TableReviews,
  TableUsers,
} from "../components";
import { useDashboardPageStyles } from "../styles/DashboardPageStyles";

const Dashboard = () => {
  const { classes, cx } = useDashboardPageStyles();
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
        <Navbar
          hiddenBreakpoint="sm"
          className={classes.navBar}
          width={{ sm: 200, lg: 300 }}
        >
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
      <Container className={classes.container}>
        {(active === "Users" || active === "Dashboard") && <TableUsers />}
        {(active === "Actors" || active === "Dashboard") && <TableActors />}
        {(active === "Movies" || active === "Dashboard") && (
          <>
            <TableMovies /> <TableReviews />
          </>
        )}
      </Container>
    </AppShell>
  );
};

export default Dashboard;

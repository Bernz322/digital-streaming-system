import { AppShell, Container, Navbar } from "@mantine/core";
import { IconUser, IconMovie, IconUsers, IconMessageDots } from "@tabler/icons";
import {
  TableActors,
  TableMovies,
  TableReviews,
  TableUsers,
} from "../components";
import { useDashboardPageStyles } from "../styles/DashboardPageStyles";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";

const Dashboard = () => {
  const { classes, cx } = useDashboardPageStyles();
  const navItems = [
    { link: "/cm/users", label: "Users", icon: IconUser },
    { link: "/cm/actors", label: "Actors", icon: IconUsers },
    { link: "/cm/movies", label: "Movies", icon: IconMovie },
    { link: "/cm/reviews", label: "Reviews", icon: IconMessageDots },
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
              <NavLink
                className={(navItem) =>
                  cx(classes.link, {
                    [classes.linkActive]:
                      Boolean(item.label) === navItem.isActive,
                  })
                }
                to={item.link}
                key={item.label}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cx(classes.linkIcon, {
                        [classes.linkActive]: Boolean(item.label) === isActive,
                      })}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </Navbar.Section>
        </Navbar>
      }
    >
      <Container className={classes.container}>
        <Routes>
          <Route index element={<Navigate to="users" />} />
          <Route path="users" element={<TableUsers />} />
          <Route path="actors" element={<TableActors />} />
          <Route path="movies" element={<TableMovies />} />
          <Route path="reviews" element={<TableReviews />} />
        </Routes>
      </Container>
    </AppShell>
  );
};

export default Dashboard;

import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { Navbar } from "./components";
import {
  Actors,
  Auth,
  Dashboard,
  Home,
  IndividualActor,
  IndividualMovie,
  Movies,
  Page404,
} from "./pages";
import "./styles/App.scss";
import "font-awesome/css/font-awesome.css";
import { useTypedDispatch, useTypedSelector } from "./hooks/rtk-hooks";
import { authCreds } from "./features/auth/authSlice";
import { isLoggedIn } from "./utils/helpers";

const App = () => {
  const { user, loggedIn } = useTypedSelector((state) => state.auth);
  const dispatch = useTypedDispatch();
  /**
   * Ensures that everytime we switch to another route, we will always be on the top page
   * https://v5.reactrouter.com/web/guides/scroll-restoration
   * https://stackoverflow.com/questions/70193712/how-to-scroll-to-top-on-route-change-with-react-router-dom-v6
   * @returns {void}
   */
  const ScrollToTop = (): null => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  useEffect(() => {
    if (isLoggedIn()) dispatch(authCreds());
  }, [dispatch]);

  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withCSSVariables
      withNormalizeCSS
    >
      <NotificationsProvider position="top-right">
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<IndividualMovie />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/actor/:id" element={<IndividualActor />} />
          {loggedIn && user.role === "admin" && (
            <Route path="/dashboard" element={<Dashboard />} />
          )}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default App;

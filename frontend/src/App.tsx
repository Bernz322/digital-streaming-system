import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { Navbar } from "./components";
import "./styles/App.scss";
import { Home } from "./pages";

const App = () => {
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

  return (
    <MantineProvider withCSSVariables withNormalizeCSS>
      <NotificationsProvider position="top-right">
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default App;

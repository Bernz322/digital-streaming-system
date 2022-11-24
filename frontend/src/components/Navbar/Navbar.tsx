import { useCallback } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { authLogout } from "../../features/auth/authSlice";
import { useTypedDispatch, useTypedSelector } from "../../hooks/rtk-hooks";
import "./Navbar.scss";

function Navbar() {
  const { loggedIn, user } = useTypedSelector((state) => state.auth);
  const dispatch = useTypedDispatch();
  const links = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "Movies",
      to: "/movies",
    },
    {
      label: "Actors",
      to: "/actors",
    },
  ];

  const handleLogout = useCallback(() => {
    dispatch(authLogout());
  }, [dispatch]);

  return (
    <header className="headerContainer">
      <nav className="innerNavContainer">
        <Link className="left" to="/">
          <img className="logo" src={logo} alt="logo" />
          <h1>ratebox</h1>
        </Link>
        <div className="center">
          {links.map((link) => {
            return (
              <Link className="navLinks" key={link.label} to={link.to}>
                <h3>{link.label}</h3>
              </Link>
            );
          })}
          {user.role === "admin" && (
            <Link className="navLinks" to="/cm">
              <h3>Dashboard</h3>
            </Link>
          )}
        </div>
        <div className="right">
          {loggedIn ? (
            <Link className="login" onClick={handleLogout} to="/auth">
              Logout
            </Link>
          ) : (
            <Link className="login" to="/auth">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

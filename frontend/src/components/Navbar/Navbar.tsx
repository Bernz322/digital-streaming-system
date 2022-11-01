import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Navbar.scss";

const Navbar = () => {
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
  return (
    <header className="headerContainer">
      <nav className="innerNavContainer">
        <Link className="left" to={"/"}>
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
          <Link className="navLinks" to="/dashboard">
            <h3>Dashboard</h3>
          </Link>
        </div>
        <div className="right">
          <Link className="login" to={"/auth"}>
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

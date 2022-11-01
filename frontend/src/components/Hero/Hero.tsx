import logo from "../../assets/logo.png";
import "./Hero.scss";
const Hero = () => {
  return (
    <div className="heroContainer">
      <div className="innerContainer">
        <div className="left">
          <h1>ratebox</h1>
          <h5>The home of many handpicked movies around the world. </h5>
          <p>
            Recognized a movie? Give them a review and let others know what you
            think of it.
          </p>
        </div>
        <div className="right">
          <img className="logo" src={logo} alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default Hero;

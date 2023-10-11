import { Link } from "react-router-dom";

const NavigationBar = () => (
  <nav className="navigation">
    <Link to="/">Home</Link>
    <Link to="/tool">Budget Tool</Link>
  </nav>
);

export default NavigationBar;

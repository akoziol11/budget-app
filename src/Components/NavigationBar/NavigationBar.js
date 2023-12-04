import React from "react";
import { Link } from "react-router-dom";
import AuthLogout from "../Authentication/AuthLogout";
import { checkUser } from "../Authentication/AuthService";

const NavigationBar = () => (
  <nav className="navigation">
    <Link to="/">Home</Link>
    <Link to="/plan">Plan</Link>
    <Link to="/budget">Track</Link>
    <Link to="/view-expenses">Expense Log</Link>
    {/* If the user is logged in, add logout button to nav bar */}
    {checkUser() && (
      <AuthLogout />
    )}
  </nav>
);

export default NavigationBar;

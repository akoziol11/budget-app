import React from "react";
import { Navigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar.js";
import { checkUser } from "../Authentication/AuthService";

const MainGood = () => {
  return (
    <div>
      <NavigationBar />
      {/* If the user is logged in, show home page, else redirect to login page */}
      {checkUser() ? (
        <div>
          <h1>Welcome to Budget Buddy!</h1>
          <br />
          <div className="container">
            <h3>Begin by selecting the "Plan" tab to begin planning your monthly budget. 
              <br/>
              <br/>
              You can also adjust your budget any time on the "Plan" page.
            </h3>
          </div>
          <br />
          <div className="container">
            <h3>At anytime, you can view and track your budget on the "Track" page.</h3>
          </div>
        </div>
      ) : (
        <Navigate to="/auth" replace />
      )}
    </div>
  );
};

export default MainGood;

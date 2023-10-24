import React, { useState } from "react";
import Parse from "parse";
import ProtectedRoute from "../../Common/ProtectedRoute";
import MainGood from "../Main/MainGood";

const AuthLogin = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const [flag, setFlag] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const checkValidUser = async () => {
        try {
          const user = await Parse.User.logIn(credentials.email, credentials.password);
          if (user) {
            setFlag(true); // Set flag to true when the user is authenticated
          } else {
            console.log("Unauthorized!");
            setFlag(false);
          }
        } catch (error) {
          if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
            // 101 error code: Invalid username or password
            alert("Invalid username or password. Please try again.");
          } else {
            // Handle other error codes or display a generic error message
            alert("An error occurred. Please try again later.");
          }
          console.error("Error:", error);
        }
      };      

    const handleSubmit = (e) => {
        e.preventDefault();
        checkValidUser(); // Call checkValidUser when the form is submitted
    };

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Email:</label>
            <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                required
            />
            </div>
            <div>
            <label>Password:</label>
            <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
            />
            </div>
            <button type="submit">Login</button>
        </form>
        {/* If authentication passes, the user can use a protected route to move to the home page */}
        {flag && (
            <ProtectedRoute exact path="/home" flag={flag} element={MainGood} />
        )}
        </div>
    );
};

export default AuthLogin;

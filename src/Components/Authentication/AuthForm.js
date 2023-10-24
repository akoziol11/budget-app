import React from "react";
import "../../auth-styles.css";

const AuthForm = ({ user, onChange, onSubmit }) => {
    return (
        <div className="auth-container">
            <form onSubmit={onSubmit}>
            <h3>Register to get started</h3>
            <br />
            <div>
                <label>First Name:</label>
                <input
                    type="text"
                    value={user.firstName}
                    onChange={onChange}
                    name="firstName"
                    required
                />
            </div>
            <div>
                <label>Last Name:</label>
                <input
                    type="text"
                    value={user.lastName}
                    onChange={onChange}
                    name="lastName"
                    required
                />
            </div>{" "}
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={user.email}
                    onChange={onChange}
                    name="email"
                    required
                />
            </div>{" "}
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={user.password}
                    onChange={onChange}
                    name="password"
                    min="0"
                    required
                />
            </div>
            <div>
                <button type="submit" onSubmit={onSubmit}>Submit</button>
            </div>
            </form>
        </div>
    );
};

export default AuthForm;

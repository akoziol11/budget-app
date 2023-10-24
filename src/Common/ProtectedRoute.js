import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, flag, ...rest }) => {
  const navigate = useNavigate();
  const goBackHandler = () => {
    navigate(-1);
  };
  console.log("rest: ", rest);

  return (
    <div>
      {flag ? (
        <Navigate to={rest.path} replace />
      ) : (
        <div>
          <p>Unauthorized!</p> <button onClick={goBackHandler}>Go Back.</button>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute;

import React, { useEffect, useState } from "react";
import { checkUser, loginUser, getCurrentUser } from "./AuthService";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";


const AuthLogin = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({
    email: "",
    password: ""
  });

  const [add, setAdd] = useState(false);

  // redirect authenticated (logged in) users depending if their budget is set or not
  useEffect(() =>  {
    const checkBudgetSetAndRedirect = async () => {
      if (checkUser()) {
        alert("You are already logged in");
        const currentUser = getCurrentUser();
        if (currentUser){
          const budgetPointer = currentUser.get("budget");
          if (budgetPointer) {
            try {
              const budget = await budgetPointer.fetch();
              const incomeTotal = budget.get("totalIncome");
              console.log("income", incomeTotal);

              if (incomeTotal === undefined) {
                // Redirect to the "/plan" page if incomeTotal is undefined (means their budget has not be planned yet)
                navigate("/plan");
              }
              else{
                navigate("/");
              }
            } catch (error) {
              console.error("Error fetching budget:", error);
            }
          }
        } else {
          navigate("/"); // user already has a budget set
        }
      }
    };
    checkBudgetSetAndRedirect();
  }, [navigate]);

  // Redirect authenticated users depending if their budget is set
  useEffect(() => {
    const loginUserAndRedirect = async () => {
      if (currentUser && add) {
        const userLoggedIn = await loginUser(currentUser);

  
        if (userLoggedIn) {
          alert(`${userLoggedIn.get("firstName")}, you successfully logged in!`);
          
          console.log("currentUser:", currentUser);
          console.log("userloggedin:", userLoggedIn);
          const budgetPointer = userLoggedIn.get("budget");
  
          if (budgetPointer) {
            try {
              const budget = await budgetPointer.fetch();
              const incomeTotal = budget.get("totalIncome");
              console.log("income", incomeTotal);
  
              if (incomeTotal === undefined) {
                // Redirect to the "/plan" page if incomeTotal is undefined (means budget has not been planned yet)
                navigate("/plan");
              }
              else{
                navigate("/");
              }
            } catch (error) {
              console.error("Error fetching budget:", error);
            }
          }
        } else {
          navigate("/");
        }
  
        setAdd(false);
      }
    };
  
    loginUserAndRedirect();
  }, [navigate, currentUser, add]);
  

  const onChangeHandler = (e) => {
    e.preventDefault();
    console.log(e.target);
    const { name, value: newValue } = e.target;
    console.log(newValue);

    setCurrentUser({
      ...currentUser,
      [name]: newValue
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log("submitted: ", e.target);
    setAdd(true);
  };


  // Login form – doesn't include first name and last name of AuthForm
  return (
    <div className = "auth-container">
      <h3> Already have an account? Sign in to get started</h3>
      <AuthForm
        user={currentUser}
        isLogin={true}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
      />
    </div>
  );
};

export default AuthLogin;

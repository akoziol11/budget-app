import React, { useEffect, useState } from "react";
import { checkUser, createUser, getCurrentUser } from "./AuthService";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";


const AuthRegister = () => {
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    budget: null
  });

  const [add, setAdd] = useState(false);

  // redirect authenticated (logged in) users back to home
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
              const incomeTotal = budget.get("incomeTotal");
              console.log("income", incomeTotal);

              if (incomeTotal === undefined) {
                // Redirect to the "/plan" page if incomeTotal is undefined (means their budget has not be planned yet)
                navigate("/plan");
              }
            } catch (error) {
              console.error("Error fetching budget:", error);
            }
          }
        } else {
          navigate("/");
        }
      }
    };
    checkBudgetSetAndRedirect();
  }, [navigate]);

  useEffect(() => {
    if (newUser && add) {
      createUser(newUser).then((userCreated) => {
        if (userCreated) {
          alert(
            `${userCreated.get("firstName")}, you successfully registered!`
          );
          console.log(userCreated.attributes)
          navigate("/plan");
        }
        setAdd(false);
      });
    }
  }, [navigate, newUser, add]);

  const onChangeHandler = (e) => {
    e.preventDefault();
    console.log(e.target);
    const { name, value: newValue } = e.target;
    console.log(newValue);

    setNewUser({
      ...newUser,
      [name]: newValue
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log("submitted: ", e.target);
    setAdd(true);
  };


  // Register form (includes first name and last name of AuthForm)
  return (
    <div className = "auth-container">
      <h3>Register to get started</h3>
      <AuthForm
        user={newUser}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
      />
    </div>
  );
};

export default AuthRegister;

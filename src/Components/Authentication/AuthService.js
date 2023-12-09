import Parse from "parse";
import { createBudget } from "../../Services/BudgetService.js";

// used in Auth components

// Create a new user with an associated budget
export const createUser = async (newUser) => {
  const user = new Parse.User();
  const newBudget = await createBudget().catch((error) => {
    console.error("Error creating budget:", error);
  });
  
  user.set("username", newUser.email);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("password", newUser.password);
  user.set("email", newUser.email);
  user.set("budget", newBudget);

  console.log("User: ", user);
  return user
    .signUp()
    .then((newUserSaved) => {
      return newUserSaved;
    })
    .catch((error) => {
      console.error("Error: ", error);
      alert(`Error: ${error.message}`);
    });
};

// used in AuthLogin component
export const loginUser = (currUser) => {
  const user = new Parse.User();

  user.set("password", currUser.password);
  user.set("username", currUser.email);

  console.log("User: ", user);
  return user
    .logIn(user.email, user.password)
    .then((currUserSaved) => {
      return currUserSaved;
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
};

// Log out the user
export const logoutUser = () => {
  return Parse.User.logOut().then(() => {
    return true;
  });
};

// Check if the user is authenticated
export const checkUser = () => {
  return Parse.User.current()?.authenticated;
};

// Get the current user
export const getCurrentUser = () => {
  return Parse.User.current();
}
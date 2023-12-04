import Parse from "parse";
import { createBudget, updateTotalIncomeForBudget, getUserBudgetID } from "./BudgetService";

export const createIncome = async ({ salary, gifts, other }) => {
  // Check for an existing budget
  let budgetId;
  const existingBudget = await getUserBudgetID();

  if (existingBudget) {
    budgetId = existingBudget;
  } else {
    const newBudget = await createBudget();
    budgetId = newBudget.id;
  }

  const Budget = Parse.Object.extend("Budget");
  const budgetPointer = new Budget();
  budgetPointer.id = budgetId;

  const currentUser = Parse.User.current();
  if (currentUser) {
    currentUser.set("budget", budgetPointer);
    await currentUser.save();
    console.log("Budget information saved for the current user");
  }

  console.log("Creating: ", { salary, gifts, other, budgetId });

  const Income = Parse.Object.extend("Income");
  const income = new Income();
  income.set("salary", parseFloat(salary));
  income.set("gifts", parseFloat(gifts));
  income.set("other", parseFloat(other));
  income.set("budget", budgetPointer);

  const totalIncome = parseFloat(salary) + parseFloat(gifts) + parseFloat(other);

  return income.save().then(async (result) => {
    // Update the total income for the associated budget
    await updateTotalIncomeForBudget(budgetId, totalIncome);

    return result;
  });
};


// READ operation - get income by ID
export const getById = (id) => {
  const Income = Parse.Object.extend("Income");
  const query = new Parse.Query(Income);
  return query.get(id).then((result) => {
    // return Income object with objectId: id
    return result;
  });
};

// READ operation - get all income in Parse class Income
export const getAllIncomes = (budgetId) => {
  const Income = Parse.Object.extend("Income");
  const query = new Parse.Query(Income);
  query.equalTo("budget", { __type: "Pointer", className: "Budget", objectId: budgetId });

  return query.find().then((results) => {
    // returns array of Income objects
    return results;
  });
};

export const getUserTotalIncome = async () => {
  const currentUser = Parse.User.current();

  if (currentUser) {
    const budgetPointer = currentUser.get("budget");

    if (budgetPointer) {
      try {
        const budget = await budgetPointer.fetch();
        const totalIncome = budget.get("totalIncome");
        console.log("total income: ", totalIncome);
        return totalIncome;
      } catch (error) {
        console.error("Error fetching budget:", error);
        return null;
      }
    } else {
      console.error("Budget information not found for the current user.");
      return null;
    }
  } else {
    console.error("Current user not found");
    return null;
  }
};
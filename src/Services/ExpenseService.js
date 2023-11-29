import Parse from "parse";
import { createBudget, getUserBudgetID, updateTotalExpensesForBudget } from "./BudgetService";

// Create a new expense
// If this is the first time creating an expense, create a new budget to associate with
export const createExpense = async ({ type, amount }) => {
  let budgetId;

  // Check for an existing budget
  const existingBudget = await getUserBudgetID();

  if (existingBudget) {
    budgetId = existingBudget.id;
  } else {
    // If a budget has not been previously created, create a new one
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
  const Expense = Parse.Object.extend("Expense");
  const expense = new Expense();
  expense.set("type", type);
  expense.set("amount", parseFloat(amount));
  expense.set("budget", { __type: "Pointer", className: "Budget", objectId: budgetId });

  return expense.save().then(async (result) => {
    // Update the total expenses for the associated budget
    await updateTotalExpensesForBudget(budgetId);
    
    return result;
  });
};


export const getExpenseById = (id) => {
  const Expense = Parse.Object.extend("Expense");
  const query = new Parse.Query(Expense);
  return query.get(id).then((result) => {
    return result;
  });
};

// Get all expenses for a given budget by the budget's ID
export const getAllExpenses = (budgetId) => {
  const Expense = Parse.Object.extend("Expense");
  const query = new Parse.Query(Expense);
  query.equalTo("budget", { __type: "Pointer", className: "Budget", objectId: budgetId });
  
  return query.find().then((results) => {
    return results;
  });
};



export const getUserTotalExpenses = async () => {
  const currentUser = Parse.User.current();

  if (currentUser) {
    const budgetPointer = currentUser.get("budget");

    if (budgetPointer) {
      try {
        const budget = await budgetPointer.fetch();
        const totalExpenses = budget.get("totalExpenses");
        return totalExpenses;
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

export const storeExpensesSelected = async (selectedExpenses) => {

}
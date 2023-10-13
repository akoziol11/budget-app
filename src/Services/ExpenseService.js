import Parse from "parse";
import { createBudget } from "./BudgetService";

// Create a new expense
// If this is the first time creating an expense, create a new budget to associate with
export const createExpense = async ({ type, amount }) => {
  let budgetId;

  // Check for an existing budget
  const existingBudget = await getMostRecentBudget();

  if (existingBudget) {
    budgetId = existingBudget.id;
  } else {
    // If a budget has not been previous created, create a new one
    const newBudget = await createBudget();
    budgetId = newBudget.id;
  }

  const Expense = Parse.Object.extend("Expense");
  const expense = new Expense();
  expense.set("type", type);
  expense.set("amount", parseFloat(amount));
  expense.set("budget", { __type: "Pointer", className: "Budget", objectId: budgetId });

  return expense.save().then((result) => {
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

// Helper function to get the most recent budget
// If a budget has already been created, this gets the most recent budget when creating 
// a new expense
const getMostRecentBudget = async () => {
    const Budget = Parse.Object.extend("Budget");
    const query = new Parse.Query(Budget);
  
    query.descending("createdAt");
  
    try {
      const mostRecentBudget = await query.first();
      return mostRecentBudget;
    } catch (error) {
      console.error("Error fetching most recent budget:", error);
      return null;
    }
  };

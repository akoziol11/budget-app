import Parse from "parse";
import { createBudget, getUserBudgetID, updateTotalExpensesForBudget } from "./BudgetService";

// Create a new expense
// If this is the first time creating an expense, create a new budget to associate with
export const createExpense = async ({ type, amount }) => {
  let budgetId;

  // Check for an existing budget
  const existingBudgetID = await getUserBudgetID(); // &* and below

   if (existingBudgetID){
    budgetId = existingBudgetID;
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


// Get the sum of the user's expenses
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

// Store the expense types the user has selected
export const storeExpensesSelected = async (expenses) => {
  try {
    const budgetId = await getUserBudgetID();

    if (!budgetId) {
      console.error("User does not have a valid budget ID");
      return;
    }

    const Budget = Parse.Object.extend("Budget");
    const budgetToUpdate = new Budget();
    budgetToUpdate.id = budgetId;

    try {
      await budgetToUpdate.fetch();
    } catch (error) {
      console.error("Error fetching budget:", error);
      return;
    }
    budgetToUpdate.set("expenseTypes", expenses);
    await budgetToUpdate.save();

    console.log("Expense types saved to the budget successfully");
  } catch (error) {
    console.error("Error storing expense types:", error);
  }
};

// Get the expense types the user selected
export const getExpenseTypes = async () => {
  try {
    // Get the user's budget ID
    const budgetId = await getUserBudgetID();

    if (!budgetId) {
      console.error("User does not have a valid budget ID");
      return null;
    }

    const Budget = Parse.Object.extend("Budget");
    const query = new Parse.Query(Budget);
    const budget = await query.get(budgetId);
    const expenseTypes = budget.get("expenseTypes");
    return expenseTypes;
  } catch (error) {
    console.error("Error getting expense types:", error);
    return null;
  }
};

// store the user's allocated budget for each expense type
// ie. the plan for each of their expenses
export const storeExpensePlan = async (expenseTypeAmounts) => {

  try {
    const budgetId = await getUserBudgetID();

    if (!budgetId) {
      console.error("User does not have a valid budget ID");
      return;
    }

    const Budget = Parse.Object.extend("Budget");
    const budgetToUpdate = new Budget();
    budgetToUpdate.id = budgetId;
    
    for (const [type, amount] of Object.entries(expenseTypeAmounts)) {
      const ExpensePlan = Parse.Object.extend("ExpensePlan");
      const expensePlan = new ExpensePlan();
      expensePlan.set("type", type);
      expensePlan.set("amount", parseFloat(amount));
      expensePlan.set("budget", budgetToUpdate);

      try {
        await expensePlan.save();
        console.log("Expense type saved to the budget successfully");
      } catch (error) {
        console.error("Error saving expense type:", error);
      }
    }
  } catch (error) {
    console.error("Error storing expense types:", error);
  }
};

// Get the amount allocated for each expense type
// ie. the expense plan for each expense type
export const getExpensePlansByBudgetId = async (budgetId) => {
  try {
    const ExpensePlan = Parse.Object.extend('ExpensePlan');
    const query = new Parse.Query(ExpensePlan);

    const budgetPointer = {
      __type: 'Pointer',
      className: 'Budget',
      objectId: budgetId,
    };
    query.equalTo('budget', budgetPointer);
    const expensePlans = await query.find();

    return expensePlans.map((expensePlan) => ({
      id: expensePlan.id,
      type: expensePlan.get('type'),
      amount: expensePlan.get('amount'),
    }));
  } catch (error) {
    console.error('Error fetching ExpensePlan items:', error);
  }
};

// Get all the user's expenses associated with their budgetId
export const getExpensesByBudgetId = async (budgetId) => {
  try {
    const Expense = Parse.Object.extend('Expense');
    const query = new Parse.Query(Expense);
    query.equalTo('budget', { __type: 'Pointer', className: 'Budget', objectId: budgetId });

    const expenses = await query.find();
    return expenses;
  } catch (error) {
    console.error('Error fetching expenses by budget ID and type:', error);
    throw error;
  }
};

// Get the user's expenses associated with their budgetId of a certain expense type
export const getExpensesByBudgetIdAndType = async (budgetId, expenseType) => {
  try {
    const Expense = Parse.Object.extend('Expense');
    const query = new Parse.Query(Expense);
    query.equalTo('budget', { __type: 'Pointer', className: 'Budget', objectId: budgetId });
    query.equalTo('type', expenseType);

    const expenses = await query.find();
    return expenses;
  } catch (error) {
    console.error('Error fetching expenses by budget ID and type:', error);
    throw error;
  }
};

// Delete all of the user's expense plans
// ie. clear the amount of their budget that they allocated for each expense type
export const deleteExpensePlansByBudgetId = async (budgetId) => {
  try {
    const budgetPointer = {
      __type: 'Pointer',
      className: 'Budget',
      objectId: budgetId,
    };

    const ExpensePlan = Parse.Object.extend('ExpensePlan');
    const query = new Parse.Query(ExpensePlan);
    query.equalTo('budget', budgetPointer);

    const expensePlans = await query.find();
    await Parse.Object.destroyAll(expensePlans);

    console.log(`ExpensePlan items for budgetId ${budgetId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting ExpensePlan items for budgetId ${budgetId}:`, error);
    throw error;
  }
};

// Delete all of the user's expenses
export const deleteAllExpenseByBudgetId = async (budgetId) => {
  try {
    const budgetPointer = {
      __type: 'Pointer',
      className: 'Budget',
      objectId: budgetId,
    };

    const Expenses = Parse.Object.extend('Expense');
    const query = new Parse.Query(Expenses);
    query.equalTo('budget', budgetPointer);

    const expenses = await query.find();
    await Parse.Object.destroyAll(expenses);
    await updateTotalExpensesForBudget(budgetId);

    console.log(`All expenses for budgetId ${budgetId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting all expenses for budgetId ${budgetId}:`, error);
    throw error;
  }
};


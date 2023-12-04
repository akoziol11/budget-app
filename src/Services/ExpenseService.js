import Parse from "parse";
import { createBudget, getUserBudgetID, updateTotalExpensesForBudget } from "./BudgetService";

// Create a new expense
// If this is the first time creating an expense, create a new budget to associate with
export const createExpense = async ({ type, amount }) => {
  let budgetId;
  console.log("Trying to create expense");

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
  console.log("testing", budgetPointer.id);

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
        console.log("total expenses: ", totalExpenses);
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

export const storeExpensesSelected = async (expenses) => {
  try {
    const budgetId = await getUserBudgetID();
    console.log("CHECKING***", budgetId); //&*

    if (!budgetId) {
      console.error("User does not have a valid budget ID");
      return;
    }

    const Budget = Parse.Object.extend("Budget");
    const budgetToUpdate = new Budget();
    budgetToUpdate.id = budgetId;

    // Fetch the existing budget
    try {
      await budgetToUpdate.fetch();
    } catch (error) {
      console.error("Error fetching budget:", error);
      return;
    }

    // Update the expenseTypes and save
    budgetToUpdate.set("expenseTypes", expenses);
    await budgetToUpdate.save();

    console.log("Expense types saved to the budget successfully");
  } catch (error) {
    console.error("Error storing expense types:", error);
  }
};

export const getExpenseTypes = async () => {
  try {
    // Get the user's budget ID
    const budgetId = await getUserBudgetID();

    if (!budgetId) {
      console.error("User does not have a valid budget ID");
      return null;
    }

    // Fetch the budget object
    const Budget = Parse.Object.extend("Budget");
    const query = new Parse.Query(Budget);
    const budget = await query.get(budgetId);

    // Retrieve and return the expenseTypes from the budget
    const expenseTypes = budget.get("expenseTypes");
    console.log("Expense types retrieved:", expenseTypes);
    return expenseTypes;
  } catch (error) {
    console.error("Error getting expense types:", error);
    return null;
  }
};


export const storeExpensePlan = async (expenseTypeAmounts) => {
  console.log("trying to store expense plan");
  console.log("before try", expenseTypeAmounts)
  try {
    const budgetId = await getUserBudgetID();
    console.log(budgetId)

    if (!budgetId) {
      console.error("User does not have a valid budget ID");
      return;
    }

    const Budget = Parse.Object.extend("Budget");
    const budgetToUpdate = new Budget();
    budgetToUpdate.id = budgetId;
    console.log("ExpenseTypeAmounts: ", expenseTypeAmounts, "budgetId**** :", budgetToUpdate.id);

    
    for (const [type, amount] of Object.entries(expenseTypeAmounts)) {
      const ExpensePlan = Parse.Object.extend("ExpensePlan");
      const expensePlan = new ExpensePlan();
      expensePlan.set("type", type);
      expensePlan.set("amount", parseFloat(amount));
      expensePlan.set("budget", budgetToUpdate);
      console.log()

      // Save the ExpensePlan
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

// Function to get all ExpensePlan items for a given budgetId
export const getExpensePlansByBudgetId = async (budgetId) => {
  try {
    const ExpensePlan = Parse.Object.extend('ExpensePlan');
    const query = new Parse.Query(ExpensePlan);

    // Create a Parse pointer to the Budget object
    const budgetPointer = {
      __type: 'Pointer',
      className: 'Budget',
      objectId: budgetId,
    };

    // Add a constraint to filter ExpensePlan items based on the provided budgetId
    query.equalTo('budget', budgetPointer);

    // Execute the query
    const expensePlans = await query.find();

    // Extract and return the data
    return expensePlans.map((expensePlan) => ({
      id: expensePlan.id,
      type: expensePlan.get('type'),
      amount: expensePlan.get('amount'),
      // Include other fields as needed
    }));
  } catch (error) {
    console.error('Error fetching ExpensePlan items:', error);
  }
};

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

export const getExpensesByBudgetIdAndType = async (budgetId, expenseType) => {
  try {
    const Expense = Parse.Object.extend('Expense');
    const query = new Parse.Query(Expense);
    query.equalTo('budget', { __type: 'Pointer', className: 'Budget', objectId: budgetId });
    query.equalTo('type', expenseType);

    const expenses = await query.find();
    console.log("budgetId, ", budgetId, "expenseType", expenseType, "epxenses", expenses);
    return expenses;
  } catch (error) {
    console.error('Error fetching expenses by budget ID and type:', error);
    throw error;
  }
};


export const deleteExpensePlansByBudgetId = async (budgetId) => {
  try {
    // Create a Parse pointer to the Budget object
    const budgetPointer = {
      __type: 'Pointer',
      className: 'Budget',
      objectId: budgetId,
    };

    // Query for ExpensePlan items associated with the provided budgetId
    const ExpensePlan = Parse.Object.extend('ExpensePlan');
    const query = new Parse.Query(ExpensePlan);
    query.equalTo('budget', budgetPointer);

    // Find and delete all matching ExpensePlan items
    const expensePlans = await query.find();
    await Parse.Object.destroyAll(expensePlans);

    console.log(`ExpensePlan items for budgetId ${budgetId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting ExpensePlan items for budgetId ${budgetId}:`, error);
    throw error;
  }
};

export const deleteAllExpenseByBudgetId = async (budgetId) => {
  try {
    // Create a Parse pointer to the Budget object
    const budgetPointer = {
      __type: 'Pointer',
      className: 'Budget',
      objectId: budgetId,
    };

    // Query for ExpensePlan items associated with the provided budgetId
    const Expenses = Parse.Object.extend('Expense');
    const query = new Parse.Query(Expenses);
    query.equalTo('budget', budgetPointer);

    // Find and delete all matching ExpensePlan items
    const expenses = await query.find();
    await Parse.Object.destroyAll(expenses);
    await updateTotalExpensesForBudget(budgetId);

    console.log(`All expenses for budgetId ${budgetId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting all expenses for budgetId ${budgetId}:`, error);
    throw error;
  }
};


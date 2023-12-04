import Parse from "parse";
import { getUserTotalExpenses } from "./ExpenseService";
import { getUserTotalIncome } from "./IncomeService";

// Create a new budget object
export const createBudget = () => {
  const Budget = Parse.Object.extend("Budget");
  const budget = new Budget();
  return budget.save().then((result) => {
    return result;
  });
};


// Get a budget by its ID
export const getBudgetById = (id) => {
  const Budget = Parse.Object.extend("Budget");
  const query = new Parse.Query(Budget);
  return query.get(id).then((result) => {
    return result;
  });
};

// READ operation - get all budgets in Parse class Budget
export const getAllBudgets = () => {
    const Budget = Parse.Object.extend("Budget");
    const query = new Parse.Query(Budget);
    return query.find().then((results) => {
      return results;
    });
  };

// export const getUserBudgetID = async () => {
//   const currentUser = Parse.User.current();

//   if (currentUser) {
//     const budgetPointer = currentUser.get("budget");

//     if (budgetPointer) {
//       return budgetPointer;
//     } else {
//       console.log("No budget pointer found for the current user.");
//       return null;
//     }
//   } else {
//     console.error("No current user found.");
//     return null;
//   }
// };

export const getUserBudgetID = async () => {
  const currentUser = Parse.User.current();

  if (currentUser) {
    const budgetPointer = currentUser.get("budget");

    if (budgetPointer) {
      return budgetPointer.id;
    } else {
      console.log("No budget pointer found for the current user.");
      return null;
    }
  } else {
    console.error("No current user found.");
    return null;
  }
};

export const updateTotalExpensesForBudget = async (budgetId) => {
  const Expense = Parse.Object.extend("Expense");
  const query = new Parse.Query(Expense);
  query.equalTo("budget", { __type: "Pointer", className: "Budget", objectId: budgetId });

  try {
    const expenses = await query.find();
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.get("amount"), 0);

    // Update the totalExpenses field in the Budget
    const Budget = Parse.Object.extend("Budget");
    const budgetToUpdate = new Budget();
    budgetToUpdate.id = budgetId;
    budgetToUpdate.set("totalExpenses", totalExpenses);
    await budgetToUpdate.save();

  } catch (error) {
    console.error("Error updating total expenses for budget:", error);
  }
};

// overwrites old totalIncome if needed
export const updateTotalIncomeForBudget = async (budgetId, totalIncome) => {
  const Budget = Parse.Object.extend("Budget");
  const budgetToUpdate = new Budget();
  budgetToUpdate.id = budgetId;


  // Set the new totalIncome value
  budgetToUpdate.set("totalIncome", totalIncome);

  try {
    // Save the updated Budget object
    await budgetToUpdate.save();
    console.log("Total income for the budget updated successfully.");
  } catch (error) {
    console.error("Error updating total income for budget:", error);
  }
};

export const getRemainingBudget = async (budgetId) => {
  let income = await getUserTotalIncome();
  let expenses = await getUserTotalExpenses();

  if (income == null){
    income = 0;
  } 
  if (expenses == null){
    expenses = 0;
  }
  return income - expenses;
}

export const setPlanComplete = async (value) => {
  console.log("called now")
  const budgetId = await getUserBudgetID();
  if (budgetId){
    const Budget = Parse.Object.extend("Budget");
    const budgetToUpdate = new Budget();
    budgetToUpdate.id = budgetId;


    // Set the new totalIncome value
    budgetToUpdate.set("planComplete", value);

    try {
      // Save the updated Budget object
      await budgetToUpdate.save();
      console.log("planComplete attribute for budget updated successfully to", value);
    } catch (error) {
      console.error("Error updating planComplete attribute for budget:", error);
    }
  } else {
    console.error("Budget information not found for the current user.");
    return null;
  }
}


export const getIsPlanComplete = async () => {
  const currentUser = Parse.User.current();
  
  if (currentUser) {
    const budgetPointer = currentUser.get("budget");
    const budgetId = budgetPointer.id;
    console.log("testing", budgetPointer);

    if (budgetId) {
      try {
        const budget = await budgetPointer.fetch();
        const isPlanComplete = budget.get("planComplete");
        console.log("ISPLANCOMPLETE", isPlanComplete);
        return isPlanComplete;
      } catch (error) {
        console.error("Error fetching whether budget plan has been complete:", error);
        return null;
      }
    } else {
      console.error("Budget information not found for the current user.");
      return null;
    }
  }
};
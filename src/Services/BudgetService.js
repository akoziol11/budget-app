import Parse from "parse";

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
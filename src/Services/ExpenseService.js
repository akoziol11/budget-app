import Parse from "parse";
/* SERVICE FOR PARSE SERVER OPERATIONS */

// CREATE operation - new income with Name
export const createExpense = ({type, amount}) => {
  console.log("Creating: ", {type, amount});
  const Expense = Parse.Object.extend("Expense");
  const expense = new Expense();
  // using setter to UPDATE the object
  expense.set("type", type);
  expense.set("amount", parseFloat(amount));
  return expense.save().then((result) => {
    // returns new Expense object
    return result;
  });
};

// READ operation - get income by ID
export const getById = (id) => {
  const Expense = Parse.Object.extend("Expense");
  const query = new Parse.Query(Expense);
  return query.get(id).then((result) => {
    // return Income object with objectId: id
    return result;
  });
};

// READ operation - get all income in Parse class Income
export const getAllExpenses = () => {
  const Expense = Parse.Object.extend("Expense");
  const query = new Parse.Query(Expense);
  return query.find().then((results) => {
    // returns array of Income objects
    return results;
  });
};
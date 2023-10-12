import Parse from "parse";
/* SERVICE FOR PARSE SERVER OPERATIONS */

// CREATE operation - new income with Name
export const createIncome = ({salary, gifts, other}) => {
  console.log("Creating: ", {salary, gifts, other});
  const Income = Parse.Object.extend("Income");
  const income = new Income();
  // using setter to UPDATE the object
  income.set("salary", parseFloat(salary));
  income.set("gifts", parseFloat(gifts));
  income.set("other", parseFloat(other));
  return income.save().then((result) => {
    // returns new Income object
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
export const getAllIncomes = () => {
  const Income = Parse.Object.extend("Income");
  const query = new Parse.Query(Income);
  return query.find().then((results) => {
    // returns array of Income objects
    return results;
  });
};
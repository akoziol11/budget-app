import Parse from "parse";
/* SERVICE FOR PARSE SERVER OPERATIONS */

// CREATE operation - new lesson with Name
export const createIncome = (Amount) => {
  console.log("Creating: ", Amount);
  const Income = Parse.Object.extend("Income");
  const income = new Income();
  // using setter to UPDATE the object
  income.set("salary", Amount);
  return income.save().then((result) => {
    // returns new Lesson object
    return result;
  });
};

// READ operation - get lesson by ID
export const getById = (id) => {
  const Income = Parse.Object.extend("Income");
  const query = new Parse.Query(Income);
  return query.get(id).then((result) => {
    // return Lesson object with objectId: id
    return result;
  });
};

// READ operation - get all lessons in Parse class Lesson
export const getAllIncomes = () => {
  const Income = Parse.Object.extend("Income");
  const query = new Parse.Query(Income);
  return query.find().then((results) => {
    // returns array of Lesson objects
    return results;
  });
};

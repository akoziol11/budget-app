import React from "react";
// Loads the JSON data into the checkboxes as a series of options
const ExpenseList = ({ options }) => {
  const optionItems = [];
  if (!Array.isArray(options)) {
    return <div>No options available</div>; // or display an error message
  }

  options.forEach((option) => {
    optionItems.push(
      <div key={option.value}>
        <label>
          <input type="checkbox" />
          {option.label}
        </label>
      </div>
    );
  });

  return <div>{optionItems}</div>;
};

export default ExpenseList;

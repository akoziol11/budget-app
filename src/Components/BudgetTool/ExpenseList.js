import React from "react";

const ExpenseList = ({ options }) => {
  // if (!Array.isArray(options)) {
  //   return <div>No options available</div>;
  // }

  const optionItems = options.map((option) => (
    <div key={option.value}>
      <label>
        <input type="checkbox" value={option.value} />
        {option.label}
      </label>
    </div>
  ));

  return <div>{optionItems}</div>;
};

export default ExpenseList;
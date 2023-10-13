import React from "react";

const ExpenseList = ({ options }) => {

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
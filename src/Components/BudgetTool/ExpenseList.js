import React from "react";

const ExpenseList = ({ options, onCheckboxChange }) => {
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    onCheckboxChange(value);
  };

  const optionItems = options.map((option) => (
    <div key={option.value}>
      <label>
        <input
          type="checkbox"
          value={option.value}
          onChange={handleCheckboxChange}
        />
        {option.label}
      </label>
    </div>
  ));

  return <div>{optionItems}</div>;
};

export default ExpenseList;
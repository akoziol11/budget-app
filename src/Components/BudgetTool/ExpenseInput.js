// Future work: only include options selected in the Expense selection form as options
// in the ExpenseInput form
import React from "react";

const ExpenseInput = ({ options, expenseData, setExpenseData }) => {
  const handleTypeChange = (event) => {
    setExpenseData({ ...expenseData, type: event.target.value });
  };

  const handleInputChange = (event) => {
    setExpenseData({ ...expenseData, amount: parseFloat(event.target.value) });
  };

  // call update expenses and also clear form after submitted
  return (
    <div>
      <form>
        <label>Select an expense type:</label>
        <select value={expenseData.type} onChange={handleTypeChange}>
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label>Enter dollar value of expense:</label>
        <input
          type="number"
          value={expenseData.amount}
          onChange={handleInputChange}
          placeholder="$$$"
          required
        />
        <br />
        <br />
      </form>
    </div>
  );
};

export default ExpenseInput;

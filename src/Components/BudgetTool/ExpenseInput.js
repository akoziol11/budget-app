import React, { useState, useEffect } from "react";
import { getExpenseTypes } from "../../Services/ExpenseService.js";

const ExpenseInput = ({ expenseData, setExpenseData }) => {
  const [expenseTypes, setExpenseTypes] = useState([]);

  useEffect(() => {
    const fetchExpenseTypes = async () => {
      try {
        const fetchedExpenseTypes = await getExpenseTypes();
        if (fetchedExpenseTypes) {
          setExpenseTypes(fetchedExpenseTypes);
          console.log("expenseTypes", fetchedExpenseTypes);
        }
      } catch (error) {
        console.error("Error fetching expense types:", error);
      }
    };

    fetchExpenseTypes();
  }, []);

  const handleTypeChange = (event) => {
    setExpenseData({ type: event.target.value, amount: "" });
  };

  const handleAmountChange = (event) => {
    console.log("New amount value:", event.target.value);
    setExpenseData({ ...expenseData, amount: event.target.value });
  };

  return (
    <div>
      <form>
        <label>Select an expense type:</label>
        <select onChange={handleTypeChange}>
          <option value="">Select an option</option>
          {expenseTypes.map((expenseType) => (
            <option key={expenseType} value={expenseType}>
              {expenseType}
            </option>
          ))}
        </select>
        <label>Enter dollar value of expense:</label>
        <input
          type="text"  // Change the input type to text
          placeholder="$$$"
          name="amount"
          value={expenseData.amount}
          required
          onChange={handleAmountChange}
        />
        <br />
        <br />
      </form>
    </div>
  );
};

export default ExpenseInput;

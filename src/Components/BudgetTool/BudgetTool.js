import React, { useState, useEffect } from "react";
import Main from "../Main/Main.js";
import { getAllOptions } from "../../Services/Options.js";
import ExpenseList from "./ExpenseList.js";
import { createIncome } from "../../Services/IncomeService.js";

const BudgetTool = () => {
  const [options, setOptions] = useState([]);
  const [incomeAmount, setIncomeAmount] = useState("");

  useEffect(() => {
    // Use an asynchronous function in useEffect to fetch options
    const fetchOptions = async () => {
      try {
        const options = await getAllOptions();
        setOptions(options);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    // Call the fetchOptions function
    fetchOptions();
  }, []); // Pass an empty dependency array to run the effect only once on mount

  const handleIncomeSubmit = async (event) => {
    event.preventDefault();

    if (incomeAmount) {
      try {
        await createIncome(incomeAmount);
        console.log("Income created successfully.");

        // Clear the input field after successful submission
        setIncomeAmount("");
      } catch (error) {
        console.error("Error creating income:", error);
      }
    }
  };

  return (
    <section>
      <h1>Welcome to the Budgeting Tool</h1>
      <div className="container">
        <form
          action="/budgetTool.php"
          id="budgetForm"
          onSubmit={handleIncomeSubmit}
        >
          <h3>Income:</h3>
          <label htmlFor="salary">Salary: </label>
          <input
            type="text"
            placeholder="$"
            name="salary"
            id="salary"
            required
            onChange={(e) => setIncomeAmount(e.target.value)}
          />
          <br />
          <label htmlFor="gifts">Gifts: </label>
          <input type="text" placeholder="$" name="gifts" id="gifts" required />
          <br />
          <label htmlFor="other">Other: </label>
          <input type="text" placeholder="$" name="other" id="other" required />
          <br />
          <h3>Expenses:</h3>
          <div>
            <ExpenseList options={options} />
          </div>
          <br />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </section>
  );
};

export default BudgetTool;

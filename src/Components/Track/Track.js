import React, { useState, useEffect } from "react";
import { getUserTotalIncome } from "../../Services/IncomeService.js";
import { createExpense } from "../../Services/ExpenseService.js"
import NavigationBar from "../NavigationBar/NavigationBar.js";
import { getAllOptions } from "../../Services/Options.js";
import ExpenseInput from "../BudgetTool/ExpenseInput.js";
import "../../expenses.css";
import { getRemainingBudget } from "../../Services/BudgetService.js";

const Expenses = () => {
  const [expenseData, setExpenseData] = useState({ type: "", amount: "" });
  const [totalIncome, setTotalIncome] = useState(null);
  const [remainingBudget, setRemainingBudget] = useState(null);
  const [options, setOptions] = useState([]);

  const fetchRemainingBudget = async () => {
    const remaining = await getRemainingBudget();
    setRemainingBudget(remaining || 0);
  };

  useEffect(() => {
    // Fetch and update the user's total income on component mount
    const fetchTotalIncome = async () => {
      const income = await getUserTotalIncome();
      setTotalIncome(income || 0);
    };
    fetchTotalIncome();
  }, []);

    useEffect(() => {
      // Fetch and update the user's total income
      const fetchRemainingBudget = async () => {
        const remaining = await getRemainingBudget();
        setRemainingBudget(remaining || 0);
      };

    fetchRemainingBudget();
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const options = await getAllOptions();
        setOptions(options);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []); ; // Pass an empty dependency array to run the effect only once on mount


  const handleExpenseSubmit = async (event) => {
    event.preventDefault();

    if (expenseData.type && expenseData.amount) {
      try {
        await createExpense(expenseData);
        console.log("Expense created successfully:", expenseData);
        // Clear the form after submission
        setExpenseData({ type: "", amount: "" });
        await fetchRemainingBudget(); 
      } catch (error) {
        console.error("Error creating expense:", error);
      }
    }
  };

  return (
    <section>
      <NavigationBar />
      <h1>Keep track of your budget and add any expenses here!</h1>
      <div className="container">
        <h1>Total monthly allowance: ${totalIncome !== null ? totalIncome.toFixed(2) : 0.00}</h1>
        <h2>Remaining balance: ${remainingBudget !== null ? remainingBudget.toFixed(2): 0.00}</h2>
      </div>
      <div className="expenses">
        <h3> Have a new expense? Add it here!</h3>
        <ExpenseInput
          options={options}
          expenseData={expenseData}
          setExpenseData={setExpenseData}
        /> 
        <button type="submit" onClick={handleExpenseSubmit}>Submit Expense</button>
      </div>
    </section>
  );
};

export default Expenses;

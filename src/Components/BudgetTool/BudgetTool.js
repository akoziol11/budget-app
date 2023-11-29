import React, { useState, useEffect } from "react";
import { getAllOptions } from "../../Services/Options.js";
import ExpenseList from "./ExpenseList.js";
import { createIncome } from "../../Services/IncomeService.js";
// import { createExpense } from "../../Services/ExpenseService.js"
import NavigationBar from "../NavigationBar/NavigationBar.js";
import { useNavigate } from "react-router-dom";

const BudgetTool = () => {
  const navigate = useNavigate();

  const [options, setOptions] = useState([]);
  const [incomeAmount, setIncomeAmount] = useState({ salary: "", gifts: "", other: "" });
  // const [expenseData, setExpenseData] = useState({ type: "", amount: "" });

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

  const handleIncomeSubmit = async (event) => {
    event.preventDefault();
    const { salary, gifts, other } = incomeAmount;

    if (salary && gifts && other) {
      try {
        await createIncome({
          salary: parseFloat(salary),
          gifts: parseFloat(gifts),
          other: parseFloat(other)
        });
        console.log("Income created successfully.");

        // Clear the form after submission
        setIncomeAmount({ salary: "", gifts: "", other: "" });

        navigate("/budget");
      } catch (error) {
        console.error("Error creating income:", error);
      }
    }
  };



  // const handleExpenseSubmit = async (event) => {
  //   event.preventDefault();

  //   if (expenseData.type && expenseData.amount) {
  //     try {
  //       await createExpense(expenseData);
  //       console.log("Expense created successfully:", expenseData);
  //       // Clear the form after submission
  //       setExpenseData({ type: "", amount: "" });
  //     } catch (error) {
  //       console.error("Error creating expense:", error);
  //     }
  //   }
  // };

  return (
    <section>
      <NavigationBar />
      <h1>Welcome to the Budgeting Tool</h1>
      <div className="container">
        <form action="/budgetTool.php" id="budgetForm" onSubmit={handleIncomeSubmit}>
        <h1>Let's begin with setting your monthly budget!</h1>
        <hr /> 
        <h3>1. Enter your income:</h3>
          <label htmlFor="salary">Salary:&nbsp;  
          <input
            type="number"
            placeholder="$"
            name="salary"
            id="salary"
            required
            value={incomeAmount.salary}
            onChange={(e) => setIncomeAmount({...incomeAmount, salary: e.target.value})}
          /></label>
          <br />
          <label htmlFor="gifts">Gifts:&nbsp;  
          <input 
            type="number" 
            placeholder="$" 
            name="gifts" 
            id="gifts" 
            required 
            value={incomeAmount.gifts}
            onChange={(e) => setIncomeAmount({...incomeAmount, gifts: e.target.value})}
            /></label>
          <br />
          <label htmlFor="other">Other:&nbsp; 
          <input 
            type="number" 
            placeholder="$" 
            name="other" 
            id="other" 
            required 
            value={incomeAmount.other}
            onChange={(e) => setIncomeAmount({...incomeAmount, other: e.target.value})}
            /></label>
          <br />
          <hr /> 
          <h3>2. Select the type of expenses you typically have:</h3>
          <div>
            <ExpenseList options={options} />
          </div>
          <br />
          <hr />
          <br />
          <button type="submit" onClick={handleIncomeSubmit}>Submit</button>  
        </form>
        {/* <div>
          <ExpenseInput
            options={options}
            expenseData={expenseData}
            setExpenseData={setExpenseData}
          />
          <button type="submit" onClick={handleExpenseSubmit}>Submit Expense</button>
        </div> */}
      </div>
    </section>
  );
};

export default BudgetTool;

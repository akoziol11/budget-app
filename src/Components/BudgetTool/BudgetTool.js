// import React, { useState, useEffect } from "react";
// import { getAllOptions } from "../../Services/Options.js";
// import ExpenseList from "./ExpenseList.js";
// import ExpenseInput from "./ExpenseInput.js";
// import { createIncome } from "../../Services/IncomeService.js";
// import { createExpense } from "../../Services/ExpenseService.js";

// const BudgetTool = () => {
//   const [options, setOptions] = useState([]);
//   const [incomeAmount, setIncomeAmount] = useState({ salary: "", gifts: "", other: "" });

//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const options = await getAllOptions();
//         setOptions(options);
//       } catch (error) {
//         console.error("Error fetching options:", error);
//       }
//     };

//     fetchOptions();
//   }, []);

//   const handleIncomeSubmit = async (event) => {
//     event.preventDefault();
//     const { salary, gifts, other } = incomeAmount;

//     if (salary && gifts && other) {
//       try {
//         await createIncome({
//           salary: parseFloat(salary),
//           gifts: parseFloat(gifts),
//           other: parseFloat(other)
//         });
//         console.log("Income created successfully.");
//         setIncomeAmount({ salary: "", gifts: "", other: "" });
//       } catch (error) {
//         console.error("Error creating income:", error);
//       }
//     }
//   };

//   const handleExpenseSubmit = async (expenseData) => {
//     try {
//       await createExpense(expenseData);
//       console.log("Expense created successfully:", expenseData);
//     } catch (error) {
//       console.error("Error creating expense:", error);
//     }
//   };

//   return (
//     <section>
//       <h1>Welcome to the Budgeting Tool</h1>
//       <div className="container">
//         <form action="/budgetTool.php" id="budgetForm" onSubmit={handleIncomeSubmit}>
//           {/* ... (income form elements) */}
//           <button type="submit">Submit</button>
//         </form>
//         <div>
//           <ExpenseList options={options} />
//         </div>
//         <div>
//           {/* Pass handleExpenseSubmit function to ExpenseInput */}
//           <ExpenseInput options={options} onSubmit={handleExpenseSubmit} />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BudgetTool;
import React, { useState, useEffect } from "react";
import { getAllOptions } from "../../Services/Options.js";
import ExpenseList from "./ExpenseList.js";
import ExpenseInput from "./ExpenseInput.js";
import { createIncome } from "../../Services/IncomeService.js";
import { createExpense } from "../../Services/ExpenseService.js"

const BudgetTool = () => {
  const [options, setOptions] = useState([]);
  const [incomeAmount, setIncomeAmount] = useState({ salary: "", gifts: "", other: "" });
  const [expenseData, setExpenseData] = useState({ type: "", amount: "" });

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
  }, []);

  const handleIncomeSubmit = async (event) => {
    event.preventDefault();
    const { salary, gifts, other } = incomeAmount;

    if (salary && gifts && other) {
      try {
        await createIncome({
          salary: parseFloat(salary),
          gifts: parseFloat(gifts),
          other: parseFloat(other),
        });
        console.log("Income created successfully.");
        setIncomeAmount({ salary: "", gifts: "", other: "" });
      } catch (error) {
        console.error("Error creating income:", error);
      }
    }
  };

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();

    if (expenseData.type && expenseData.amount) {
      try {
        await createExpense(expenseData);
        console.log("Expense created successfully:", expenseData);
        // Reset expenseData after submission
        setExpenseData({ type: "", amount: "" });
      } catch (error) {
        console.error("Error creating expense:", error);
      }
    }
  };

  return (
    <section>
      <h1>Welcome to the Budgeting Tool</h1>
      <div className="container">
        <form action="/budgetTool.php" id="budgetForm" onSubmit={handleIncomeSubmit}>
        <h3>Income:</h3>
          <label htmlFor="salary">Salary: </label>
          <input
            type="number"
            placeholder="$"
            name="salary"
            id="salary"
            required
            value={incomeAmount.salary}
            onChange={(e) => setIncomeAmount({...incomeAmount, salary: e.target.value})}
          />
          <br />
          <label htmlFor="gifts">Gifts: </label>
          <input 
            type="number" 
            placeholder="$" 
            name="gifts" 
            id="gifts" 
            required 
            value={incomeAmount.gifts}
            onChange={(e) => setIncomeAmount({...incomeAmount, gifts: e.target.value})}
            />
          <br />
          <label htmlFor="other">Other: </label>
          <input 
            type="number" 
            placeholder="$" 
            name="other" 
            id="other" 
            required 
            value={incomeAmount.other}
            onChange={(e) => setIncomeAmount({...incomeAmount, other: e.target.value})}
            />
          <br />
          <h3>Expenses:</h3>
          <div>
            <ExpenseList options={options} />
          </div>
          <br />
          <button type="submit">Submit</button>
        </form>
        <div>
          <ExpenseInput
            options={options}
            expenseData={expenseData}
            setExpenseData={setExpenseData}
          />
          <button type="submit" onClick={handleExpenseSubmit}>Submit Expense</button>
        </div>
      </div>
    </section>
  );
};

export default BudgetTool;

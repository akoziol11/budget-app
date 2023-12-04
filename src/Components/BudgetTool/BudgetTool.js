import React, { useState, useEffect } from "react";
import { getAllOptions } from "../../Services/Options.js";
import ExpenseList from "./ExpenseList.js";
import { createIncome } from "../../Services/IncomeService.js";
import NavigationBar from "../NavigationBar/NavigationBar.js";
import { useNavigate } from "react-router-dom";
import { getExpensePlansByBudgetId, storeExpensesSelected, deleteAllExpenseByBudgetId } from "../../Services/ExpenseService.js";
import { getUserBudgetID, setPlanComplete } from "../../Services/BudgetService.js";

const BudgetTool = () => {
  const navigate = useNavigate();

  const [options, setOptions] = useState([]);
  const [incomeAmount, setIncomeAmount] = useState({ salary: "", gifts: "", other: "" });
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [customExpense, setCustomExpense] = useState("");
  // Used to check if the user already has a plan set
  const [planSet, setPlanSet] = useState(false); // update variable names to be existingPlan

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const options = await getAllOptions();
        setOptions(options);
        const budgetId = await getUserBudgetID();
        const expensePlans = await getExpensePlansByBudgetId(budgetId); // &*
        if (expensePlans.length !==  0)
        {
          setPlanSet(true);
        }
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

        await storeExpensesSelected(selectedExpenses);

        console.log("Income created successfully.");
        setPlanComplete(false);

        setIncomeAmount({ salary: "", gifts: "", other: "" });
        setSelectedExpenses([]);

        console.log("planSet", planSet);
        if (planSet){
          const willContinue = window.confirm("You already have a budget set. This will overwrite your old budget and expenses. Do you want to continue?");
          if (!willContinue){
            return
          }
        }
        const budgetPointer = await getUserBudgetID(); // &*
        console.log("PTR", budgetPointer);
        await deleteAllExpenseByBudgetId(budgetPointer.id);
        navigate("/plan/expenses");
      } catch (error) {
        console.error("Error creating income:", error);
      }
    }
  };

  const handleAddCustomExpense = () => {
    if (customExpense.trim() !== "") {
      setOptions((prevOptions) => [
        ...prevOptions,
        { value: customExpense, label: customExpense },
      ]);
      setCustomExpense("");
    }
  };

const handleCheckboxChange = (value) => {
    setSelectedExpenses((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((expense) => expense !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };

  return (
    <section>
      <NavigationBar />
      <div className="container">
        <form action="/budgetTool.php" id="budgetForm" onSubmit={handleIncomeSubmit}>
          <h1>Welcome to the Budgeting Tool</h1>
          <div style={{ marginBottom: "20px" }}>
            <h2>Let's begin with setting your monthly budget!</h2>
            <hr />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <h3>1. Enter your income:</h3>
            <label>
              Salary:&nbsp;
              <input
                type="number"
                placeholder="$"
                name="salary"
                required
                value={incomeAmount.salary}
                onChange={(e) => setIncomeAmount({ ...incomeAmount, salary: e.target.value })}
              />
            </label>
            <br />
            <label>
              Gifts:&nbsp;
              <input
                type="number"
                placeholder="$"
                name="gifts"
                required
                value={incomeAmount.gifts}
                onChange={(e) => setIncomeAmount({ ...incomeAmount, gifts: e.target.value })}
              />
            </label>
            <br />
            <label>
              Other:&nbsp;
              <input
                type="number"
                placeholder="$"
                name="other"
                required
                value={incomeAmount.other}
                onChange={(e) => setIncomeAmount({ ...incomeAmount, other: e.target.value })}
              />
            </label>
            <hr />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <h3>2. Select the type of expenses you typically have:</h3>
            <ExpenseList options={options} onCheckboxChange={handleCheckboxChange} onAddCustomExpense={handleAddCustomExpense} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>
              Custom Expense:
              <input
                type="text"
                value={customExpense}
                onChange={(e) => setCustomExpense(e.target.value)}
              />
            </label>
            <button type="button" onClick={handleAddCustomExpense}>
              Add
            </button>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <hr />
            <button type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BudgetTool;


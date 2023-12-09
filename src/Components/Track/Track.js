import React, { useState, useEffect, useRef, useCallback } from "react";
import Chart from 'chart.js/auto';
import { getUserTotalIncome } from "../../Services/IncomeService.js";
import { createExpense, getExpensePlansByBudgetId } from "../../Services/ExpenseService.js";
import NavigationBar from "../NavigationBar/NavigationBar.js";
import { getAllOptions } from "../../Services/Options.js";
import ExpenseInput from "../BudgetTool/ExpenseInput.js";
import "../../expenses.css";
import { getRemainingBudget, getIsPlanComplete } from "../../Services/BudgetService.js";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../Authentication/AuthService.js";
import ExpenseTracker from "./ExpenseTracker.js";
import { getExpensesByBudgetIdAndType } from "../../Services/ExpenseService.js";

const Track = () => {
  const [expenseData, setExpenseData] = useState({ type: "", amount: "" });
  const [totalIncome, setTotalIncome] = useState(null);
  const [remainingBudget, setRemainingBudget] = useState(null);
  const [options, setOptions] = useState([]);
  const [isOverBudget, setIsOverBudget] = useState(false);
  const [budgetSet, setBudgetSet] = useState(false);
  const [updatedRemainingExpenseBudgets, setUpdatedRemainingExpenseBudgets] = useState({});
  const [updateExpenseTracker, setUpdateExpenseTracker] = useState(false);

  const chartRef = useRef(null);
  const navigate = useNavigate();

  // Get user's remaining balance/budget
  const fetchRemainingBudget = async () => {
    let remaining = await getRemainingBudget();
    setRemainingBudget(remaining || 0);
    return remaining;
  };

  // Get user's total income
  useEffect(() => {
    const fetchTotalIncome = async () => {
      const income = await getUserTotalIncome();
      setTotalIncome(income || 0);
    };

    fetchTotalIncome();
  }, []);

  // Update tracker chart
  const updateDoughnutChart = useCallback((usedBudget, remainingBudget) => {
    if (budgetSet && chartRef.current) {
      const context = chartRef.current.getContext('2d');

      if (context) {
        if (chartRef.current.chart) {
          chartRef.current.chart.destroy();
        }

        chartRef.current.chart = new Chart(context, {
          type: 'doughnut',
          data: {
            labels: ['Used Budget', 'Remaining Budget'],
            datasets: [{
              data: [usedBudget, remainingBudget],
              backgroundColor: ['#FF6384', '#36A2EB'],
            }],
          },
        });
      }
    }
  }, [budgetSet]);

  // Check if the user is over budget and update chart
  useEffect(() => {
    const fetchRemainingBudget = async () => {
      const remaining = await getRemainingBudget();
      setRemainingBudget(remaining || 0);
      updateDoughnutChart(totalIncome - remaining, remaining);
      setIsOverBudget(remaining < 0);
    };

    fetchRemainingBudget();
  }, [totalIncome, updateDoughnutChart]);

  // Get all expense type options
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

  // Check if the user's budget is set and redirect if needed
  useEffect(() => {
    const checkBudgetSetAndRedirect = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        const budgetPointer = currentUser.get("budget");
        if (budgetPointer) {
          try {
            const budget = await budgetPointer.fetch();
            const expenseTypes = budget.get("expenseTypes");
            const isPlanComplete = await getIsPlanComplete();

            if (expenseTypes === undefined || expenseTypes.length <= 0) {
              alert("Set your budget first!");
              navigate("/plan");
            } else if (!isPlanComplete) {
              alert("Finish setting up your budget first!");
              navigate("/plan/expenses");
            } else {
              setBudgetSet(true);
            }
          } catch (error) {
            console.error("Error fetching budget:", error);
          }
        }
      }
    };
    checkBudgetSetAndRedirect();
  }, [navigate]);

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();
    if (expenseData.type && expenseData.amount) {
      try {
        await createExpense(expenseData);
  
        const remaining = await fetchRemainingBudget();
        setRemainingBudget((prevRemainingBudget) => {
          const usedBudget = totalIncome - prevRemainingBudget;
          updateDoughnutChart(usedBudget, prevRemainingBudget);
  
          // Update isOverBudget based on the new remaining budget
          setIsOverBudget(remaining < 0);
  
          return remaining;
        });
  
        // Calculate and update total expenses for each expense type
        const updatedRemainingExpenseBudgetsForExpenseType = await calculateTotalExpenses();
        setUpdatedRemainingExpenseBudgets(updatedRemainingExpenseBudgetsForExpenseType);

        // check if the expense tracker needs to be refreshed/updated
        if (updateExpenseTracker) {
          updateExpenseTracker((prev) => !prev);
        }
  
        // Empty form after form is submitted
        setExpenseData({ type: "", amount: "" });
      } catch (error) {
        console.error("Error creating expense:", error);
      }
    }
  };
  
  // Calculate total expenses across all expense types
  const calculateTotalExpenses = async () => {
    let budgetId = null;
    const totalExpenses = {};
    const currentUser = getCurrentUser();
    if (currentUser) {
      const budgetPointer = currentUser.get("budget");
      if (budgetPointer) {
        budgetId = budgetPointer.id;
      }
    }

    const expensePlans = await getExpensePlansByBudgetId(budgetId);

    for (const plan of expensePlans) {
      try {
        const expenses = await getExpensesByBudgetIdAndType(budgetId, plan.type);
        let totalAmount = 0;
        for (const expense of expenses) {
          totalAmount += expense.attributes.amount;
        }
        totalExpenses[plan.type] = totalAmount;
      } catch (error) {
        console.error(`Error fetching expenses for type ${plan.type}:`, error);
      }
    }

    return totalExpenses;
  };

  return (
    <section>
      <NavigationBar />
      {budgetSet && (
        <div className="container">
          <h1>Keep track of your budget and add any expenses here!</h1>
          <h1>Total monthly allowance: ${totalIncome !== null ? totalIncome.toFixed(2) : 0.00}</h1>
          {!isOverBudget && <h2>Remaining balance: ${remainingBudget !== null ? remainingBudget.toFixed(2) : 0.00}</h2>}
          {isOverBudget && <h2>Warning! You are over budget by ${Math.abs(remainingBudget).toFixed(2)}!</h2>}
          {totalIncome !== null && <canvas ref={chartRef} width="100" height="100"></canvas>}
          <div className="expenses">
            <hr/>
            <h3> Have a new expense? Add it here!</h3>
            <ExpenseInput options={options} expenseData={expenseData} setExpenseData={setExpenseData} />
            <button type="submit" onClick={handleExpenseSubmit}>Submit Expense</button>
          </div>
          <div>
            {(totalIncome !== null) && (totalIncome !== remainingBudget) && (
              <ExpenseTracker
                updatedRemainingExpenseBudgets={updatedRemainingExpenseBudgets}
                updateExpenseTracker={setUpdateExpenseTracker}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Track;

import React, { useState, useEffect, useRef } from "react";
import Chart from 'chart.js/auto';
import { getUserTotalIncome } from "../../Services/IncomeService.js";
import { createExpense } from "../../Services/ExpenseService.js";
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
  const chartRef = useRef(null);

  const fetchRemainingBudget = async () => {
    const remaining = await getRemainingBudget();
    setRemainingBudget(remaining || 0);
  };

  useEffect(() => {
    const fetchTotalIncome = async () => {
      const income = await getUserTotalIncome();
      setTotalIncome(income || 0);
    };

    fetchTotalIncome();
  }, []);

  useEffect(() => {
    const fetchRemainingBudget = async () => {
      const remaining = await getRemainingBudget();
      setRemainingBudget(remaining || 0);
      updateDoughnutChart(totalIncome - remaining, remaining);
    };

    fetchRemainingBudget();
  }, [totalIncome]);

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

  const updateDoughnutChart = (usedBudget, remainingBudget) => {
    const context = chartRef.current.getContext('2d');
  
    // Check if a chart instance already exists
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }
  
    // Create a new Chart instance
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
  };
  

 const handleExpenseSubmit = async (event) => {
    event.preventDefault();

    if (expenseData.type && expenseData.amount) {
      try {
        await createExpense(expenseData);
        console.log("Expense created successfully:", expenseData);
        // Clear the form after submission
        setExpenseData({ type: "", amount: "" });

        // Fetch and update the remaining budget
        await fetchRemainingBudget();

        // Calculate used budget and update the doughnut chart
        const usedBudget = totalIncome - remainingBudget;
        updateDoughnutChart(usedBudget, remainingBudget);
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
        <canvas ref={chartRef} width="300" height="300"></canvas>
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


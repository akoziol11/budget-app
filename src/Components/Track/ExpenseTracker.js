import React, { useState, useEffect } from "react";
import { getExpensePlansByBudgetId } from "../../Services/ExpenseService.js";
import { getCurrentUser } from "../Authentication/AuthService.js";
import { getExpensesByBudgetIdAndType } from "../../Services/ExpenseService.js";
import "../../expense-tracker.css";

const ExpenseTracker = ({ updatedRemainingExpenseBudgets, updateExpenseTracker }) => {
  const [expensePlans, setExpensePlans] = useState([]);
  const [totalExpensesByType, setTotalExpensesByType] = useState({});

  // Get user's expense plans (ie. plans/budget for each expense type)
  const fetchExpensePlans = async () => {
    try {
      const currentUser = getCurrentUser();
      if (currentUser) {
        const budgetPointer = currentUser.get("budget");
        if (budgetPointer) {
          const plans = await getExpensePlansByBudgetId(budgetPointer.id);
          setExpensePlans(plans);
        }
      }
    } catch (error) {
      console.error('Error fetching expense plans:', error);
    }
  };

  useEffect(() => {
    fetchExpensePlans();
  }, [updateExpenseTracker]);

  // Sum user's total expenses for expense types in their plan
  useEffect(() => {
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

      setTotalExpensesByType(totalExpenses);
    };

    calculateTotalExpenses();
  }, [expensePlans, updatedRemainingExpenseBudgets, updateExpenseTracker]);

  return (
    <div className="expense-tracker-container">
      <h1>Expense Tracker</h1>
      <ul className="expense-list">
        {expensePlans.map((plan) => (
          <li key={plan.id} className="expense-item">
            {plan.type}: {totalExpensesByType !== null && totalExpensesByType[plan.type] !== undefined &&
              <b className="expense-details">
                Used: ${(totalExpensesByType[plan.type]).toFixed(2)} –– Remaining: ${(Math.max(plan.amount - totalExpensesByType[plan.type], 0)).toFixed(2)}
                {plan.amount - totalExpensesByType[plan.type] < 0 && (
                  <b style={{ color: 'red' }}>
                   &nbsp; Warning! Over budget by ${Math.abs(plan.amount - totalExpensesByType[plan.type]).toFixed(2)}
                  </b>
                )}
              </b>}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ExpenseTracker;

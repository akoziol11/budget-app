import React, { useEffect, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar.js";
import { getCurrentUser } from "../Authentication/AuthService.js";
import { useNavigate } from "react-router-dom";
import { getExpensesByBudgetId, deleteAllExpenseByBudgetId } from "../../Services/ExpenseService.js";
import { getIsPlanComplete } from "../../Services/BudgetService.js";
import "../../expense-tracker.css";

const ExpenseLog = () => {

  const [budgetSet, setBudgetSet] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  // Check if user's budget is completed
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
                const allExpenses = await getExpensesByBudgetId(budgetPointer.id);
                const sortedExpenses = allExpenses.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setExpenses(sortedExpenses);
              }
            } catch (error) {
              console.error("Error fetching budget:", error);
            }
          }
        }
      };
      checkBudgetSetAndRedirect();
    }, [navigate]);
    
  // Delete all of the user's expenses (clearing expense log)
  const handleDeleteAllExpenses = async () => {
      try {
        // Assuming that the budgetId is available in the same scope
        const currentUser = getCurrentUser();
        if (currentUser) {
          const budgetPointer = currentUser.get("budget");
          if (budgetPointer) {
            const budgetId = budgetPointer.id;
  
            // Call the function to delete all expenses for the current budget
            await deleteAllExpenseByBudgetId(budgetId);
  
            // After deleting expenses, you may want to update the state to reflect the changes
            setExpenses([]);
          }
        }
      } catch (error) {
        console.error("Error deleting all expenses:", error);
      }
    };


  return (
    <section>
    <NavigationBar />
    {budgetSet && (
        <div className="expense-tracker-container">
            <h3> View your individual expenses here!</h3>
            <button onClick={handleDeleteAllExpenses}>Delete All Expenses </button>
            {expenses.length > 0 ? (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              Date: {new Date(expense.createdAt).toLocaleString()} {expense.attributes.type}, ${expense.attributes.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses available for the current budget.</p>
      )}
        </div>
    )}
    </section>
  );
};

export default ExpenseLog;

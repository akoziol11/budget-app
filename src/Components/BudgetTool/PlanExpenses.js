import React, { useState, useEffect } from "react";
import { getExpenseTypes, storeExpensePlan } from "../../Services/ExpenseService.js";
import NavigationBar from "../NavigationBar/NavigationBar.js";
import { getUserTotalIncome } from "../../Services/IncomeService.js";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../Authentication/AuthService.js";
import { deleteExpensePlansByBudgetId } from "../../Services/ExpenseService.js";
import { setPlanComplete, getIsPlanComplete } from "../../Services/BudgetService.js";

const PlanExpenses = () => {
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [totalIncome, setTotalIncome] = useState(null);
  const [expenseTypeAmounts, setExpenseTypeAmounts] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotalIncome = async () => {
      const income = await getUserTotalIncome();
      setTotalIncome(income || 0);
    };
    fetchTotalIncome();
  }, []);

  useEffect(() => {
    const fetchExpenseTypes = async () => {
      try {
        const fetchedExpenseTypes = await getExpenseTypes();
        if (fetchedExpenseTypes) {
          const initialAmounts = {};
          fetchedExpenseTypes.forEach((type) => {
            initialAmounts[type] = "";
          });
          setExpenseTypeAmounts(initialAmounts);

          setExpenseTypes(fetchedExpenseTypes);
        }
      } catch (error) {
        console.error("Error fetching expense types:", error);
      }
    };

    fetchExpenseTypes();
  }, []);

  useEffect(() =>  {
    const checkBudgetSetAndRedirect = async () => {
      const currentUser = getCurrentUser();
      if (currentUser){
        const budgetPointer = currentUser.get("budget");
        if (budgetPointer) {
          try {
            const budget = await budgetPointer.fetch();
            const expenseTypes = budget.get("expenseTypes");
            const isPlanComplete = await getIsPlanComplete();

            if (expenseTypes.length <= 0) {
              alert("Set your budget first!")
              // Redirect to the "/plan" page if incomeTotal is undefined (means their budget has not be planned yet)
              navigate("/plan");
            } else if (isPlanComplete) {
              navigate("/");
            }
          } catch (error) {
            console.error("Error fetching budget:", error);
          }
        }
      }
    };
    checkBudgetSetAndRedirect();
  }, [navigate]);


  const handleExpensePlanSubmit = async (event) => {
    event.preventDefault();
    let total = 0;
    Object.entries(expenseTypeAmounts).forEach(([type, amount]) => {
        console.log("type: ", type, "amount: ", amount);
        total = total + parseFloat(amount);
    });
    console.log("total", total);
    if (total !== totalIncome){
        alert("Your expenses do not sum to your budget! Please adjust your values.")
    } else {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          const budgetPointer = currentUser.get("budget");
          if (budgetPointer) {
            // Delete existing expense plans
            await deleteExpensePlansByBudgetId(budgetPointer.id);

            // Create new expense plans with updated values
            await storeExpensePlan(expenseTypeAmounts);
            await setPlanComplete(true);
            
            navigate("/budget");
          }
        }
      } catch (error) {
        console.error("Error updating expense plans:", error);
      }
    }
  };


  const handleExpenseTypeChange = (type, amount) => {
    setExpenseTypeAmounts((prevAmounts) => ({
      ...prevAmounts,
      [type]: amount,
    }));
  };

  return (
    <section>
      <NavigationBar />
      <div className="container">
        <h1>Set your budget for each expense type!</h1>
        <h1>Your total budget is: ${totalIncome !== null ? totalIncome.toFixed(2) : 0.00}</h1>
        <br />
        {expenseTypes.map((expenseType) => (
          <div key={expenseType}>
            <label>
              {expenseType}:&nbsp;
              <input
                type="number"
                value={expenseTypeAmounts[expenseType]}
                placeholder="$$$"
                required
                onChange={(e) => handleExpenseTypeChange(expenseType, e.target.value)}
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={handleExpensePlanSubmit}>
          Submit
        </button>
      </div>
    </section>
  );
};

export default PlanExpenses;

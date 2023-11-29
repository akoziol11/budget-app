import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route
} from "react-router-dom";
import AuthModule from "./Authentication/Auth.js";
import AuthRegister from "./Authentication/AuthRegister";
import ProtectedRoute from "../Common/ProtectedRoute.js";
import MainGood from "./Main/MainGood.js";
import BudgetTool from "../Components/BudgetTool/BudgetTool.js"
import Expenses from "./Track/Track.js"

// Add protected route for BudgetTool
export default function Components() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthModule />} />
        <Route path="/auth/register" element={<AuthRegister />} />
        <Route
          path="/"
          element={<ProtectedRoute path="/" element={MainGood} />}
        />
        <Route path="/plan" element={<ProtectedRoute path="/plan" element={BudgetTool} />} />
        <Route path="/budget" element={<ProtectedRoute path="/budget" element={Expenses} />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}
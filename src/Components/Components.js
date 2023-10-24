import Main from "./Main/Main";
import BudgetTool from "./BudgetTool/BudgetTool";
import NavigationBar from "./NavigationBar/NavigationBar";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import AuthRegister from "./Authentication/AuthRegister.js";


export default function Components() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/tool" element={<BudgetTool />} />
        <Route path="/register" element={<AuthRegister />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}
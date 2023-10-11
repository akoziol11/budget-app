import Main from "./Main/Main";
import BudgetTool from "./BudgetTool/BudgetTool";
import NavigationBar from "./NavigationBar/NavigationBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function Components() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/tool" element={<BudgetTool />} />
      </Routes>
    </Router>
  );
}

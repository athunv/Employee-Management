import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import EmployerRegister from "./components/EmployerRegister";
import Employer from "./components/Employer";
import Login from "./components/Login";
import DynamicForm from "./components/DynamicForm";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<EmployerRegister />} />
        <Route path="" element={<Login />} />
        <Route path="/employer" element={<Employer />} />
        <Route path="/create-form" element={<DynamicForm/>}/> 
      </Routes>
    </Router>
  );
}

export default App;

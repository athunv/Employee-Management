import React, { useEffect, useState } from "react";
import Api from "../api/allApi";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function Employer() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({name: "", email: "", phone_number: "", position: "",});
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await Api.get("/employee/");
        setEmployees(response.data);
        setFilteredEmployees(response.data); 
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredEmployees(
      employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(term) ||
          employee.email.toLowerCase().includes(term) ||
          employee.position.toLowerCase().includes(term)
      )
    );
  };

  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post("employee/", newEmployee);
      const updatedEmployees = [...employees, response.data];
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees); 
      setNewEmployee({ name: "", email: "", phone_number: "", position: "" });
      setMessage("Employee created successfully!");
    } catch (error) {
      setMessage("Failed to create employee.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await Api.delete(`/employee/${id}/`);
      const updatedEmployees = employees.filter(
        (employee) => employee.id !== id
      );
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees); 
      setMessage("Employee deleted successfully!");
    } catch (error) {
      setMessage("Failed to delete employee.");
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="container mt-5">
      {message && <div className="alert alert-info">{message}</div>}
      <h2 className="text-center mb-4">Manage Employees</h2>

      <div className="row">
       
        <div className="col-md-6">
          <div className="card p-4">
            <h4>Create New Employee</h4>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input type="text" name="name" value={newEmployee.name} onChange={handleChange} className="form-control" placeholder="Employee Name" required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input type="email" name="email" value={newEmployee.email} onChange={handleChange} className="form-control" placeholder="Email" required />
              </div>
              <div className="mb-3">
                <label htmlFor="phone_number" className="form-label">
                  Phone Number
                </label>
                <input type="text" name="phone_number" value={newEmployee.phone_number} onChange={handleChange} className="form-control" placeholder="Phone Number" required />
              </div>
              <div className="mb-3">
                <label htmlFor="position" className="form-label">
                  Position
                </label>
                <input type="text" name="position" value={newEmployee.position} onChange={handleChange} className="form-control" placeholder="Position" required />
              </div>
              <button type="submit" className="btn btn-primary">
                Create Employee
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3 d-flex justify-content-between">
            <div>
              <input type="text" className="form-control" placeholder="Search employees " value={searchTerm} onChange={handleSearch} />
            </div>
            <div>
              <Link to="/create-form" className="btn btn-outline-info">
                Create Form
              </Link>
            </div>
          </div>
          <h4 className="mb-3">Employee List</h4>
          {filteredEmployees.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.name}</td>
                      <td>{employee.position}</td>
                      <td>{employee.email}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(employee.id)} > Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No employees found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Employer;

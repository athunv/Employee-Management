import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api, { setAuthToken } from '../api/allApi';
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
    
      const response = await Api.post('token/', formData);
      const { access, refresh } = response.data;

     
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);

      
      setAuthToken(access);

      
      navigate('/employer');
    } catch (error) {
     
      setError(error.response?.data?.detail || 'Invalid username or password');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-control" placeholder="Enter your username" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Enter your password" required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
        <Link to={'/register'} className='btn btn-warning w-100 mt-3'>Register</Link>
      </form>
      
      {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
    </div>
  );
}

export default Login;

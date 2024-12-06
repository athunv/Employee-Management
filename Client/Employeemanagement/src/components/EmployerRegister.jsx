import React, { useState } from 'react';
import Api from '../api/allApi';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function EmployerRegister() {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await Api.post('register/', formData);
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      {message && <div className={`alert ${loading ? 'alert-warning' : 'alert-info'} mt-3 text-center`}>{message}</div>}
      <h2 className="text-center mb-4">Employer Register</h2>
      <form onSubmit={handleSubmit} className="p-4  border rounded shadow-sm">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required/>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <Link to={'/'} className='btn btn-warning w-100 mt-3'>Login Now</Link>
      </form>
    </div>
  );
}

export default EmployerRegister;

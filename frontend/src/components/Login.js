import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/users/login`, formData);
            localStorage.setItem('token', response.data.token);
            navigate('/recipes');
            
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">התחבר</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">מייל</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">סיסמה</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary w-100">התחבר</button>
                </form>
                <div className="text-center mt-3">
                    <p>Don't have an account? <a href="/signup">הרשם</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;

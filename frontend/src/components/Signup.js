import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/users/signup`, formData);
            setSuccess('Signup successful! You can now log in.');
            setError('');
        } catch (err) {
            setError('Error during signup: ' + (err.response?.data?.error || 'Unknown error.'));
            setSuccess('');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">שם</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            name="name"
                            placeholder="הכנס שם"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">מייל (לא ניתן לשנות בהמשך)</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            name="email"
                            placeholder="הכנס כתובת מייל"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">סיסמה</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            name="password"
                            placeholder="צור סיסמה"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">הרשם</button>
                    {success && <div className="alert alert-success mt-3">{success}</div>}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </form>
                <div className="text-center mt-3">
                    <p>יש לך כבר חשבון? <a href="/login">התחבר</a></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

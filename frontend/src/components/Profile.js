import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null); // שמירת פרטי המשתמש
    const [formData, setFormData] = useState({ name: '', password: '' }); // טופס לעדכון
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    useEffect(() => {
        // קבלת פרטי המשתמש המחובר
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${backendUrl}/api/users/profile`, {
                    headers: { Authorization: token },
                });
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to fetch profile');
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${backendUrl}/api/users/profile`, formData, {
                headers: { Authorization: token },
            });
            setUser(response.data);
            setSuccess('Profile updated successfully!');
            setError('');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
            setSuccess('');
        }
    };

    if (!user) return <div className="text-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white text-center">
                            <h3>פרופיל משתמש</h3>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            <div className="mb-4">
                                <p><strong>שם:</strong> {user.name}</p>
                                <p><strong>מייל:</strong> {user.email}</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <h5 className="mb-3">עדכון פרטים</h5>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">שם חדש</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="הזן שם חדש"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">סיסמה חדשה</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="הזן סיסמה חדשה"
                                        className="form-control"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">עדכן פרופיל</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

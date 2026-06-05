import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './Register.css';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { isLoggedIn, setIsLoggedIn, setUserName } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn || sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [isLoggedIn, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store auth token and user details in session storage
                sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('name', data.name);
                sessionStorage.setItem('email', data.email);
                setIsLoggedIn(true);
                setUserName(data.name);
                navigate('/app');
            } else {
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create an Account</h2>
                    <p className="auth-subtitle">Join GiftLink and start sharing joy</p>
                </div>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control auth-input"
                            id="name"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control auth-input"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control auth-input"
                            id="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary auth-btn w-100">Register</button>
                </form>
                <div className="auth-footer text-center mt-3">
                    <p>Already have an account? <Link to="/app/login" className="auth-link">Login here</Link></p>
                </div>
            </div>
        </div>
    );
}

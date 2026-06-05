import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
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
                setError(data.error || 'Invalid credentials. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p className="auth-subtitle">Log in to your GiftLink account</p>
                </div>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <form onSubmit={handleLogin}>
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary auth-btn w-100">Login</button>
                </form>
                <div className="auth-footer text-center mt-3">
                    <p>Don't have an account? <Link to="/app/register" className="auth-link">Register here</Link></p>
                </div>
            </div>
        </div>
    );
}

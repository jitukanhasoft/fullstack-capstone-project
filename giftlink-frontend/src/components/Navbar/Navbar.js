import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('auth-token');
        const name = sessionStorage.getItem('name');
        if (token && name) {
            setIsLoggedIn(true);
            setUserName(name);
        }
    }, [setIsLoggedIn, setUserName]);

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
        setUserName("");
        navigate('/app');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
            <Link className="navbar-brand font-weight-bold" to="/app">GiftLink</Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app/search">Search</Link>
                    </li>
                </ul>

                <ul className="navbar-nav ms-auto">
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item d-flex align-items-center">
                                <span className="nav-link text-dark me-3" style={{ fontWeight: '600' }}>Hi, {userName}</span>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link me-2" to="/app/profile">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link logout-btn text-white py-1 px-3" onClick={handleLogout} style={{ border: 'none', textDecoration: 'none' }}>Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link login-btn text-white py-1 px-3 me-2" to="/app/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link btn btn-outline-primary py-1 px-3" to="/app/register" style={{ borderRadius: '0.25rem' }}>Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

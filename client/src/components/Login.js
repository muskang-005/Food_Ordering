// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/features/authSlice';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useUserContext } from './UserContext'; // Import the UserContext

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { setUserId } = useUserContext(); // Destructure setUserId from context

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.userType === 'admin') {
                navigate('/manage-product');
            } else {
                navigate('/');
            }
            setUserId(user.id); // Set userId in context
        }
    }, [isAuthenticated, user, navigate, setUserId]); // Add setUserId to dependencies

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await dispatch(login(credentials)).unwrap();
            setUserId(userData.userId); // Set userId in context after login
        } catch (error) {
            console.error('Login failed:', error); // Log the error for debugging
            alert(error.message || 'Login failed: Please check your credentials and try again.'); // User-friendly message
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="email"
                    name="username"
                    placeholder="Email"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;

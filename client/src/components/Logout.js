import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Assume AuthContext is set up

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:501/logout');

            // Clear user info from context
            console.log('logged out front end')
            logout();

            // Redirect to login page
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
            alert('Logout failed: ' + err.message);
        }
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;

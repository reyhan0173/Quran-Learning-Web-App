import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from "./AuthContext";

const LogoutButton = () => {
    const navigate = useNavigate();
    const { setUser, setUserGroup, setTokens, tokens } = useContext(AuthContext); // Access global state setters and tokens

    const handleGlobalLogout = async () => {
        try {
            // Send the access token to the logout endpoint
            await axios.post('http://localhost:501/logout')

            // Clear the context states
            setUser(null);
            setUserGroup(null);
            setTokens(null);

            // Redirect to login page
            navigate('/login');
        } catch (err) {
            console.error('Global sign out error:', err);
            alert('Global sign out error: ' + err.message);
        }
    };

    return (
        <button onClick={handleGlobalLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;

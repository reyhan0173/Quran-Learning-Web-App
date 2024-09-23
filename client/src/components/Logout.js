import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import {GiExitDoor} from "react-icons/gi"; // Assume AuthContext is set up

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:501/logout', {}, {withCredentials: true});

            // Clear user info from context
            console.log('logged out front end')
            logout();
        } catch (err) {
            console.error('Logout error:', err);
            alert('Logout failed: ' + err.message);
        }
    };

    return (
      <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 px-">
          <GiExitDoor className="h-6 w-6"/>
      </button>
    );
};

export default LogoutButton;

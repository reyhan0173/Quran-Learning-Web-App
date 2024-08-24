import React from 'react';
import axios from 'axios';

const handleGlobalLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        try {
            const response = await axios.post('http://localhost:501/logout', { accessToken });
            console.log(response.data.message);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('idToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userGroup');
            window.location.href = '/login'; // Redirect to login page
        } catch (err) {
            console.error('Global sign out error:', err);
            alert('Global sign out error: ' + err.message);
        }
    } else {
        console.error('No access token found');
        alert('No access token found');
    }
};

export default handleGlobalLogout;

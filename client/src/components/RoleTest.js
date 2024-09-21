// RoleTest.js
import React, { useState } from 'react';
import axios from 'axios';

const RoleTest = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const checkAccess = async () => {
        try {
            // Clear previous messages
            setMessage('');
            setError('');

            // Make a request to the protected /test endpoint
            const response = await axios.get('http://localhost:501/test', {
                withCredentials: true, // Send cookies with the request
            });

            // Set the message from the response
            setMessage(response.data.message);
        } catch (err) {
            // If there's an error, display it
            if (err.response && err.response.status === 403) {
                setError('Access denied: You do not have the required role.');
            } else {
                setError('An error occurred: ' + err.message);
            }
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '300px', margin: '20px auto' }}>
            <h3>Test Role-Based Access</h3>
            <button onClick={checkAccess} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Check Access
            </button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default RoleTest;

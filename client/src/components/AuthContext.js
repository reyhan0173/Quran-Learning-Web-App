import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Define the shape of your authentication context
const AuthContext = createContext({
    authData: null,  // Initially, authData is null (includes login state and role)
    login: (data) => {},  // login expects to be called with data (auth data)
    logout: () => {},     // logout doesn't expect any arguments
    checkAuthStatus: () => {}, // function to check session persistence
});

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState({
        isAuthenticated: false,
        role: null,
    });  // Initially, not authenticated and no role

    // Function to handle login
    const login = (data) => {
        setAuthData({
            isAuthenticated: true,
            role: data.role,  // Save the role from login data
        });
    };

    // Function to handle logout
    const logout = () => {
        setAuthData({
            isAuthenticated: false,
            role: null,  // Clear authentication data on logout
        });
        // Optionally, remove the authentication cookie
    };

    // Function to check if the user is already authenticated
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get("http://3.129.90.105:5000/check-auth-status", { withCredentials: true });
            const { role } = response.data;

            if (role) {
                // If valid session exists, update context
                setAuthData({
                    isAuthenticated: true,
                    role,  // Update role
                });
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            // If there's an error (e.g., no valid session), stay logged out
            setAuthData({
                isAuthenticated: false,
                role: null,
            });
        }
    };

    // On component mount, check the authentication status
    useEffect(() => {
        checkAuthStatus();
    }, []); // Run only on initial load

    return (
        <AuthContext.Provider value={{ authData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

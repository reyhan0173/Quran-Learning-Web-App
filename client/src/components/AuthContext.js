import React, { createContext, useState, useContext } from 'react';

// Define the shape of your authentication context
const AuthContext = createContext({
    authData: null,  // Initially, authData is null
    login: (data) => {},  // login expects to be called with data
    logout: () => {},     // logout doesn't expect any arguments
});

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(null);  // Initially, no authData

    // Function to handle login
    const login = (data) => {
        setAuthData(data);  // Set the authentication data when logging in
    };

    // Function to handle logout
    const logout = () => {
        setAuthData(null);  // Clear authentication data on logout
    };

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

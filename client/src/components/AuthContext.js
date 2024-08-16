import React, { createContext, useState, useContext } from 'react';

// Create a context for authentication and role with a default value
export const AuthContext = createContext({
    authData: null,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(null);

    const login = (data) => {
        setAuthData(data);
    };

    const logout = () => {
        setAuthData(null);
    };

    return (
        <AuthContext.Provider value={{ authData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for accessing auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

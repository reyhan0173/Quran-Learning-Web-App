import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './components/Login';
import { AuthProvider, useAuth } from './components/AuthContext';

function Main() {
    const { authData } = useAuth(); // Access authData from context
    const navigate = useNavigate();

    React.useEffect(() => {
        // Redirect based on authentication status
        if (authData.isAuthenticated) {
            navigate('/'); // Redirect to dashboard if authenticated
        } else {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [authData, navigate]);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<App />} />
        </Routes>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <AuthProvider>
            <Main />
        </AuthProvider>
    </Router>
);

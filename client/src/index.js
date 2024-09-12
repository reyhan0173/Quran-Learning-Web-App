import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './components/Login';
import { AuthProvider } from './components/AuthContext';

function Main() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Function to check if the user is logged in based on cookies
    const checkLoginStatus = () => {
      const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));
      if (authToken) {
        console.log('Auth token found, navigating to App.');
        navigate('/'); // Redirect to the root or dashboard page
      } else {
        console.log('No auth token found, navigating to Login.');
        navigate('/login'); // Redirect to login if not authenticated
      }
    };

    checkLoginStatus();
  }, [navigate]);

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

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './components/Login';
import { AuthProvider, useAuth } from './components/AuthContext';

function loadCSS(filename) {
  const link = document.createElement('link');
  link.href = `${process.env.PUBLIC_URL}/${filename}`;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.className = 'dynamic-css'; // Add a class name to identify it later
  document.head.appendChild(link);
}

function unloadCSS(filename) {
  const links = document.getElementsByClassName('dynamic-css');
  for (let i = 0; i < links.length; i++) {
    if (links[i].href.includes(filename)) {
      document.head.removeChild(links[i]);
    }
  }
}

function Main() {
  // Use the auth context here
  const { authData } = useAuth();
  try {
    console.log(authData.isAuthenticated);
  } catch (error) {}

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // Check if user is already logged in based on auth data
    if (authData && authData.isAuthenticated) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [authData]);

  React.useEffect(() => {
    if (isLoggedIn) {
      unloadCSS('Login.css');
      loadCSS('main.css');
    } else {
      unloadCSS('main.css');
      loadCSS('Login.css');
    }

    // Cleanup function to remove dynamic CSS on component unmount
    return () => {
      unloadCSS('Login.css');
      unloadCSS('main.css');
    };
  }, [isLoggedIn]);

  return (isLoggedIn ? <App /> : <Login />);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <Main />
  </AuthProvider>
);

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './components/Login';
import AWS from 'aws-sdk';

// AWS Cognito configuration
AWS.config.region = 'us-east-2'; // Replace with your region
const cognito = new AWS.CognitoIdentityServiceProvider();

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      cognito.getUser({ AccessToken: accessToken }, (err, data) => {
        if (err) {
          console.error(err);
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      });
    }
  }, []);

  useEffect(() => {
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

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
      <React.StrictMode>
        {isLoggedIn ? <App /> : <Login onLogin={handleLogin} />}
      </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);

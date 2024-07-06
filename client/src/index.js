import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './components/Login';

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
    if (isLoggedIn) {
      unloadCSS('Login.css');
      loadCSS('main.css');
    } else {
      unloadCSS('App.css');
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

// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import Login from './components/Login';
// import './main.css'
// // import './approveHomework.css'
//
// function Main() {
//   return (
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// }
//
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<Main />);
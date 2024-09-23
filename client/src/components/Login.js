import AWS from "aws-sdk";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from './AuthContext'; // Import the custom hook

AWS.config.update({
  region: 'us-east-2',
});

export default function Login({ onLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Use the login function from context

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:501/signup", {
        firstName,
        lastName,
        phoneNumber,
        email,
        dateOfBirth,
        username,
        password
      });
      console.log('Sign up response:', response.data); // Log response
      alert(response.data);
      onLogin();
    } catch (err) {
      console.error('Sign up error:', err);
      alert('Sign up error: ' + err.message);
    }
  };

  const handleLogin = async (e) => {
    console.log("logging in...");

    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:501/login", { username, password }, { withCredentials: true });

      console.log('Login response:', response.data); // Log response
      const { role } = response.data;

      // Make sure role is received and valid
      if (role) {
        login({ role }); // Call login from context to update auth state
        console.log('Login successful, role:', role);
        // Optionally navigate to another page based on role or login success
      } else {
        console.error('No role returned in response');
      }



    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed: ' + err.message);
    }
  };

  return (
      <div className="wrapper">
        <div className="form-wrapper sign-in">
          <form id="logIn-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            <div className="input-group">
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder=" "
                  required
              />
              <label>Username</label>
            </div>
            <div className="input-group">
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  required
              />
              <label>Password</label>
            </div>
            <div className="forgot-pass">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="btn">Login</button>
            <div className="sign-link">
              <p>Don't have an account? <a href="#" className="signUp-link">Sign Up</a></p>
            </div>
          </form>
        </div>
      </div>
  );
}

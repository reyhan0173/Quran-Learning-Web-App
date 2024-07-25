import React, { useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";

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
      alert(response.data);
      onLogin();
    } catch (err) {
      console.error('Sign up error:', err);
      alert('Sign up error: ' + err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:501/login", {
        username,
        password
      });

      const { authenticationResult, group } = response.data;
      const { AccessToken, IdToken, RefreshToken } = authenticationResult;


      console.log('AccessToken:', AccessToken); // Log the AccessToken
      console.log('IdToken:', IdToken); // Log the IdToken
      console.log('RefreshToken:', RefreshToken); // Log the RefreshToken

      if (AccessToken && IdToken && RefreshToken) {
        localStorage.setItem('accessToken', AccessToken);
        localStorage.setItem('idToken', IdToken);
        localStorage.setItem('refreshToken', RefreshToken);
        localStorage.setItem('userGroup', group); // Store user group

        onLogin(); // Call parent function to handle login state change
      } else {
        throw new Error('Tokens are undefined');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login error: ' + err.message);
    }
  };


  return (
      <div className="wrapper">
        <div className="form-wrapper sign-up">
          <form id="signUp-form" onSubmit={handleSignUp}>
            <h2>Sign Up</h2>
            <div className="name-input">
              <div className="input-group">
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder=" "
                    required
                />
                <label>First Name</label>
              </div>
              <div className="input-group">
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder=" "
                    required
                />
                <label>Last Name</label>
              </div>
            </div>
            <div className="input-group phone-group">
              <div className="code-input">
                <select
                    value="+1" // Default value, change if needed
                    onChange={(e) => console.log(e.target.value)} // Implement onChange handler as per requirement
                    required
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+91">🇮🇳 +91</option>
                </select>
              </div>
              <div className="phone-input">
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder=" "
                    required
                />
                <label>Phone Number</label>
              </div>
            </div>
            <div className="input-group">
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
              />
              <label>Email</label>
            </div>
            <div className="input-group">
              <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  placeholder=" "
                  required
              />
              <label>Date of Birth</label>
            </div>
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
            <button type="submit" className="btn">Sign Up</button>
            <div className="sign-link">
              <p>Already have an account? <a href="#" className="signIn-link">Sign In</a></p>
            </div>
          </form>
        </div>

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

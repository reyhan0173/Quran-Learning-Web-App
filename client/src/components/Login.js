import React, { useState } from "react";
import AWS from "aws-sdk";

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

    const cognito = new AWS.CognitoIdentityServiceProvider();
    const signUpParams = {
      ClientId: '1f6l25k8h5f4gc3ldo1a7kcb2e',
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
        { Name: 'phone_number', Value: phoneNumber },
        { Name: 'email', Value: email },
        { Name: 'birthdate', Value: dateOfBirth },
        // Add more user attributes as needed
      ]
    };

    try {
      const data = await cognito.signUp(signUpParams).promise();
      console.log('Sign up success:', data);
      // Optionally handle success, navigate to login, etc.
      alert('Sign up successful! Please check your email for verification.');
      onLogin();
    } catch (err) {
      console.error('Sign up error:', err);
      alert('Sign up error: ' + err.message);
      // Handle sign up errors (e.g., username taken, validation errors)
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const cognito = new AWS.CognitoIdentityServiceProvider();
    const loginParams = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: '1f6l25k8h5f4gc3ldo1a7kcb2e',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    };

    try {
      const data = await cognito.initiateAuth(loginParams).promise();
      console.log('Login success:', data);

      if (data.AuthenticationResult) {
        const { AccessToken, IdToken, RefreshToken } = data.AuthenticationResult;

        // Store tokens in localStorage (you might want to secure this in production)
        localStorage.setItem('accessToken', AccessToken);
        localStorage.setItem('idToken', IdToken);
        localStorage.setItem('refreshToken', RefreshToken);

        // Optionally handle success, navigate to app, etc.
        onLogin();
      } else {
        console.error('Login error: No authentication result found');
        alert('Login error: No authentication result found');
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

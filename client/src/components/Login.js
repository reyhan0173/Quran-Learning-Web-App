import React, { useEffect, useState } from "react";

export default function Login({ onLogin }) {
  useEffect(() => {
    const wrapper = document.querySelector('.wrapper');
    const signUpLink = document.querySelector('.signUp-link');
    const signInLink = document.querySelector('.signIn-link');

    signUpLink.addEventListener('click', () => {
      wrapper.classList.add('animate-signIn');
      wrapper.classList.remove('animate-signUp');
    });

    signInLink.addEventListener('click', () => {
      wrapper.classList.add('animate-signUp');
      wrapper.classList.remove('animate-signIn');
    });

    document.querySelectorAll('.input-group input').forEach(input => {
      input.addEventListener('input', () => {
        if (input.value) {
          input.classList.add('not-empty');
        } else {
          input.classList.remove('not-empty');
        }
      });
    });
  }, []);

  const handleSignUp = (e) => {
    e.preventDefault();
    // Perform sign-up logic here
    onLogin();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Perform login logic here
    onLogin();
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper sign-up">
        <form onSubmit={handleSignUp}>
          <h2>Sign Up</h2>
          <div className="input-group">
            <input type="text" required placeholder=" " />
            <label>Username</label>
          </div>
          <div className="input-group">
            <input type="email" required placeholder=" " />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input type="password" required placeholder=" " />
            <label>Password</label>
          </div>
          <button type="submit" className="btn">Sign Up</button>
          <div className="sign-link">
            <p>Already have an account? <a href="#" className="signIn-link">Sign In</a></p>
          </div>
        </form>
      </div>

      <div className="form-wrapper sign-in">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className="input-group">
            <input type="text" required placeholder=" " />
            <label>Username</label>
          </div>
          <div className="input-group">
            <input type="password" required placeholder=" " />
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

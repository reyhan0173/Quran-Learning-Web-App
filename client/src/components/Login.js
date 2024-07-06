import React, { useEffect } from "react";

export default function Login({ onLogin }) {
  useEffect(() => {
    const wrapper = document.querySelector('.wrapper');
    const signUpLink = document.querySelector('.signUp-link');
    const signInLink = document.querySelector('.signIn-link');
    const signUpForm = wrapper.querySelector('.form-wrapper.sign-up form');
    const signInForm = wrapper.querySelector('.form-wrapper.sign-in form');

    signUpLink.addEventListener('click', () => {
      wrapper.classList.add('animate-signIn');
      wrapper.classList.remove('animate-signUp');
      signUpForm.style.display = 'block';
      signUpForm.classList.add('fade-in');
      signInForm.classList.add('fade-out');

      setTimeout(() => {
        signInForm.style.display = 'none';
        signInForm.classList.remove('fade-out');
      }, 1400);
    });

    signInLink.addEventListener('click', () => {
      wrapper.classList.add('animate-signUp');
      wrapper.classList.remove('animate-signIn');
      signInForm.style.display = 'block';
      signInForm.classList.add('fade-in');
      signUpForm.classList.add('fade-out');

      setTimeout(() => {
        signUpForm.style.display = 'none';
        signUpForm.classList.remove('fade-out');
      }, 1400)
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
          <form id="signUp-form" onSubmit={handleSignUp}>
            <h2>Sign Up</h2>
            <div className="name-input">
              <div className="input-group">
                <input type="text" required placeholder=" " />
                <label>First Name</label>
              </div>
              <div className="input-group">
                <input type="text" required placeholder=" " />
                <label>Last Name</label>
              </div>
            </div>
            <div className="input-group phone-group">
              <div className="code-input">
                <select required>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+91">🇮🇳 +91</option>
                </select>
              </div>
              <div className="phone-input">
                <input type="tel" required placeholder=" " />
                <label>Phone Number</label>
              </div>
            </div>
            <div className="input-group">
              <input type="email" required placeholder=" " />
              <label>Email</label>
            </div>
            <div className="input-group">
              <input type="date" required placeholder=" " />
              <label>Date of Birth</label>
            </div>
            <div className="input-group">
              <input type="text" required placeholder=" " />
              <label>Username</label>
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
          <form id="logIn-form" onSubmit={handleLogin}>
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
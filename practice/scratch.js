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

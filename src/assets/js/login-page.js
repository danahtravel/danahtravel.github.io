(function() {
  'use strict';

  // Password visibility toggle
  const toggleBtn = document.getElementById('togglePassword');
  const passwordField = document.getElementById('loginPassword');
  if (toggleBtn && passwordField) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordField.type === 'password' ? 'text' : 'password';
      passwordField.type = type;
      toggleBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });
  }

  // Login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      const remember = document.getElementById('rememberMe')?.checked || false;

      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }
      // Demo: you would send a fetch request to your backend here
      console.log(`Login attempt: ${email}, remember: ${remember}`);
      alert(`Demo: Welcome back, ${email}!\nIntegrate with your authentication API.`);
      // window.location.href = '/dashboard';
    });
  }

  // Social login placeholders
  const googleBtn = document.getElementById('googleLoginBtn');
  const facebookBtn = document.getElementById('facebookLoginBtn');
  const appleBtn = document.getElementById('appleLoginBtn');
  if (googleBtn) googleBtn.addEventListener('click', () => alert('Google login – integrate OAuth'));
  if (facebookBtn) facebookBtn.addEventListener('click', () => alert('Facebook login – integrate OAuth'));
  if (appleBtn) appleBtn.addEventListener('click', () => alert('Apple login – integrate OAuth'));

  // Forgot password placeholder
  const forgotLink = document.getElementById('forgotPasswordLink');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Password reset link will be sent to your registered email.');
    });
  }
})();
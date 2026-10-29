/**
 * AI Inclusive Assessment System - Authentication & Session Management
 * Demonstrates client-side authentication flow, demo profiles, and route protection.
 * NOTE: Frontend-only authentication is for demonstration and does not provide server security.
 */

class AuthManager {
  constructor() {
    this.storage = window.storage;
  }

  getCurrentUser() {
    return this.storage ? this.storage.getUser() : null;
  }

  isLoggedIn() {
    const user = this.getCurrentUser();
    return !!(user && user.isLoggedIn);
  }

  requireAuth() {
    if (!this.isLoggedIn()) {
      // Store intended destination
      sessionStorage.setItem('redirect_after_login', window.location.href);
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  login(email, password, rememberMe = false) {
    return new Promise((resolve, reject) => {
      // Basic frontend validation
      if (!email || !password) {
        return reject(new Error('Please provide both email and password.'));
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return reject(new Error('Please enter a valid email address.'));
      }

      // Simulate a network latency for realism
      setTimeout(() => {
        const currentUser = this.getCurrentUser() || {};
        const updatedUser = {
          ...currentUser,
          email: email.trim(),
          name: currentUser.name || 'Demo Student',
          isLoggedIn: true,
          rememberMe: !!rememberMe
        };

        this.storage.setUser(updatedUser);
        resolve(updatedUser);
      }, 400);
    });
  }

  quickDemoLogin(categoryKey = 'none') {
    const user = {
      id: `demo-${categoryKey}-${Date.now().toString().slice(-4)}`,
      name: categoryKey === 'none' ? 'Demo Student' : `Demo Student (${categoryKey.replace('_', ' ').toUpperCase()})`,
      email: `${categoryKey}@demo-inclusive.edu`,
      category: categoryKey,
      joinedDate: new Date().toISOString().split('T')[0],
      dailyGoal: 10,
      isLoggedIn: true
    };

    this.storage.setUser(user);

    // Apply category preferences
    if (window.accessibility) {
      window.accessibility.applyCategoryPreset(categoryKey);
    }

    window.location.href = 'dashboard.html';
  }

  register({ name, email, password, confirmPassword, category }) {
    return new Promise((resolve, reject) => {
      if (!name || !name.trim()) {
        return reject(new Error('Please enter your full name.'));
      }
      if (!email || !email.trim()) {
        return reject(new Error('Please enter your email address.'));
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return reject(new Error('Please enter a valid email address.'));
      }
      if (!password || password.length < 8) {
        return reject(new Error('Password must be at least 8 characters long.'));
      }
      if (!/\d/.test(password)) {
        return reject(new Error('Password must contain at least one number.'));
      }
      if (password !== confirmPassword) {
        return reject(new Error('Passwords do not match.'));
      }
      if (!category) {
        return reject(new Error('Please select a learner category preference.'));
      }

      setTimeout(() => {
        const newUser = {
          id: `student-${Date.now().toString().slice(-6)}`,
          name: name.trim(),
          email: email.trim(),
          category: category,
          joinedDate: new Date().toISOString().split('T')[0],
          dailyGoal: 10,
          isLoggedIn: true
        };

        this.storage.setUser(newUser);

        // Apply category preset
        if (window.accessibility) {
          window.accessibility.applyCategoryPreset(category);
        }

        resolve(newUser);
      }, 500);
    });
  }

  confirmLogout() {
    this.showLogoutModal();
  }

  showLogoutModal() {
    let modalBackdrop = document.getElementById('logoutModalBackdrop');
    if (!modalBackdrop) {
      modalBackdrop = document.createElement('div');
      modalBackdrop.id = 'logoutModalBackdrop';
      modalBackdrop.className = 'modal-backdrop';
      modalBackdrop.innerHTML = `
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="logoutModalTitle">
          <div class="modal-header">
            <h3 class="modal-title" id="logoutModalTitle">Confirm Log Out</h3>
            <button type="button" class="btn-close" id="btnLogoutCancelTop" aria-label="Close dialog">&times;</button>
          </div>
          <div class="modal-body">
            <p style="margin-bottom: 0.75rem;">Are you sure you want to log out of your session?</p>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0;">
              In this frontend demo, your session will end and you will return to the login screen. 
              Your local assessment progress and accessibility preferences remain saved in browser storage.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="btnLogoutCancel">Cancel</button>
            <button type="button" class="btn btn-danger" id="btnLogoutConfirm">Log Out</button>
          </div>
        </div>
      `;
      document.body.appendChild(modalBackdrop);

      // Wire up cancel events
      const closeModal = () => modalBackdrop.classList.remove('show');
      modalBackdrop.querySelector('#btnLogoutCancel').addEventListener('click', closeModal);
      modalBackdrop.querySelector('#btnLogoutCancelTop').addEventListener('click', closeModal);
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
      });

      // Confirm Logout event
      modalBackdrop.querySelector('#btnLogoutConfirm').addEventListener('click', () => {
        closeModal();
        this.performLogout();
      });
    }

    modalBackdrop.classList.add('show');
  }

  performLogout() {
    const user = this.getCurrentUser();
    if (user) {
      user.isLoggedIn = false;
      this.storage.setUser(user);
    }
    window.location.href = 'login.html?status=logged_out';
  }
}

// Global singleton instance
window.auth = new AuthManager();

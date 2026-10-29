/**
 * AI Inclusive Assessment System - Core Application UI Controller
 * Orchestrates shared layouts, navigation, responsive drawer, notifications,
 * topbar user state, and accessibility hotkeys across all pages.
 */

class ApplicationController {
  constructor() {
    this.storage = window.storage;
    this.auth = window.auth;
    this.accessibility = window.accessibility;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupMobileMenu();
      this.setupProfileDropdown();
      this.setupLogoutButtons();
      this.updateTopbarUser();
      this.highlightActiveNav();
      this.setupGlobalKeybindings();
    });
  }

  setupMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.app-sidebar');

    if (mobileBtn && sidebar) {
      let backdrop = document.querySelector('.sidebar-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        document.body.appendChild(backdrop);
      }

      const toggleMenu = () => {
        const isOpen = sidebar.classList.toggle('open');
        backdrop.classList.toggle('show', isOpen);
      };

      mobileBtn.addEventListener('click', toggleMenu);
      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('show');
      });
    }
  }

  setupProfileDropdown() {
    const profileBtn = document.getElementById('topbarUserBtn');
    const dropdown = document.getElementById('profileDropdown');

    if (profileBtn && dropdown) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== profileBtn) {
          dropdown.classList.remove('show');
        }
      });
    }
  }

  setupLogoutButtons() {
    document.querySelectorAll('.btn-trigger-logout').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.auth) {
          this.auth.confirmLogout();
        }
      });
    });
  }

  updateTopbarUser() {
    if (!this.storage) return;
    const user = this.storage.getUser();
    if (!user) return;

    // Topbar & sidebar user elements
    const topName = document.getElementById('topbarUserName');
    const topAvatar = document.getElementById('topbarUserAvatar');
    const sideName = document.getElementById('sidebarUserName');
    const sideAvatar = document.getElementById('sidebarUserAvatar');
    const catBadge = document.getElementById('topbarCategoryBadge');
    const sideCatLabel = document.getElementById('sidebarCategoryLabel');

    const firstLetter = (user.name || 'D').charAt(0).toUpperCase();

    if (topName) topName.textContent = user.name || 'Demo Student';
    if (topAvatar) topAvatar.textContent = firstLetter;
    if (sideName) sideName.textContent = user.name || 'Demo Student';
    if (sideAvatar) sideAvatar.textContent = firstLetter;

    // Category Label & Badge
    const presets = this.accessibility ? this.accessibility.getPresets() : {};
    const catKey = user.category || 'none';
    const catPreset = presets[catKey] || presets.none;

    if (catBadge) {
      catBadge.textContent = `${catPreset.icon} ${catPreset.name}`;
      catBadge.className = `quick-pref-badge badge-category-${catKey.replace('_', '-')}`;
    }

    if (sideCatLabel) {
      sideCatLabel.textContent = catPreset.name;
    }
  }

  highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  setupGlobalKeybindings() {
    document.addEventListener('keydown', (e) => {
      // Escape closes open modals or dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal-backdrop.show');
        if (openModal) {
          openModal.classList.remove('show');
        }
        const openDropdown = document.querySelector('.profile-menu-dropdown.show');
        if (openDropdown) {
          openDropdown.classList.remove('show');
        }
        const openSidebar = document.querySelector('.app-sidebar.open');
        if (openSidebar) {
          openSidebar.classList.remove('open');
          const backdrop = document.querySelector('.sidebar-backdrop');
          if (backdrop) backdrop.classList.remove('show');
        }
      }
    });
  }

  showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

// Global application instance
window.app = new ApplicationController();

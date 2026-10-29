/**
 * AI Inclusive Assessment System - Profile Management Module
 * Manages viewing and editing the student's demo profile and learning preferences.
 */

class ProfileManager {
  constructor() {
    this.storage = window.storage;
    this.accessibility = window.accessibility;
  }

  loadProfileData() {
    const user = this.storage ? this.storage.getUser() : {};
    const prefs = this.storage ? this.storage.getPreferences() : {};
    const goal = this.storage ? this.storage.getDailyGoal() : { target: 10 };
    const history = this.storage ? this.storage.getHistory() : [];
    const streak = this.storage ? this.storage.getStreak() : { currentStreak: 1 };

    // Fill form elements if present
    const nameInput = document.getElementById('profileName');
    const emailInput = document.getElementById('profileEmail');
    const categorySelect = document.getElementById('profileCategory');
    const goalSelect = document.getElementById('profileGoal');
    const joinedEl = document.getElementById('profileJoinedDate');
    const avatarEl = document.getElementById('profileAvatarLetter');
    const displayNameEl = document.getElementById('profileDisplayName');
    const userEmailEl = document.getElementById('profileDisplayEmail');
    const badgeCategoryEl = document.getElementById('profileCategoryBadge');

    // Stats
    const statAssessments = document.getElementById('profileStatAssessments');
    const statQuestions = document.getElementById('profileStatQuestions');
    const statStreak = document.getElementById('profileStatStreak');

    if (nameInput) nameInput.value = user.name || 'Demo Student';
    if (emailInput) emailInput.value = user.email || 'student@example.edu';
    if (categorySelect) categorySelect.value = user.category || 'none';
    if (goalSelect) goalSelect.value = goal.target || 10;
    
    if (joinedEl) {
      const d = user.joinedDate ? new Date(user.joinedDate) : new Date();
      joinedEl.textContent = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    if (avatarEl) {
      avatarEl.textContent = (user.name || 'D').charAt(0).toUpperCase();
    }
    if (displayNameEl) displayNameEl.textContent = user.name || 'Demo Student';
    if (userEmailEl) userEmailEl.textContent = user.email || 'student@example.edu';

    if (badgeCategoryEl) {
      const catKey = user.category || 'none';
      const presets = this.accessibility ? this.accessibility.getPresets() : {};
      const catName = presets[catKey] ? presets[catKey].name : 'No Special Need';
      badgeCategoryEl.className = `badge badge-category-${catKey.replace('_', '-')}`;
      badgeCategoryEl.textContent = catName;
    }

    if (statAssessments) statAssessments.textContent = history.length;
    if (statQuestions) {
      const totalQ = history.reduce((sum, item) => sum + (item.totalQuestions || 0), 0);
      statQuestions.textContent = totalQ;
    }
    if (statStreak) statStreak.textContent = `${streak.currentStreak || 1} Days`;
  }

  saveProfile(formData) {
    const { name, email, category, dailyGoal } = formData;

    if (!name || !name.trim()) {
      throw new Error('Name cannot be empty.');
    }
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    const currentUser = this.storage.getUser();
    const oldCategory = currentUser.category;

    currentUser.name = name.trim();
    currentUser.email = email.trim();
    currentUser.category = category;
    this.storage.setUser(currentUser);

    // Save daily goal
    if (dailyGoal) {
      this.storage.setDailyGoalTarget(parseInt(dailyGoal, 10));
    }

    // If category changed, offer to apply category preset
    if (category !== oldCategory && this.accessibility) {
      this.accessibility.applyCategoryPreset(category);
    }

    // Refresh UI
    this.loadProfileData();

    if (window.app && window.app.showToast) {
      window.app.showToast('Profile preferences updated in browser storage.', 'success');
    }
  }

  resetAllData() {
    if (confirm('Are you sure you want to reset all demo learning history and restore default settings?')) {
      this.storage.resetDemoData();
      if (this.accessibility) {
        this.accessibility.applyCategoryPreset('none');
      }
      alert('Demo data has been restored to default.');
      window.location.reload();
    }
  }
}

// Global singleton instance
window.profileManager = new ProfileManager();

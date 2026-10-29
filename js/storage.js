/**
 * AI Inclusive Assessment System - Local Storage & Mock Data Management
 * Handles non-sensitive browser storage for demo state, learning records, and preferences.
 */

const STORAGE_KEYS = {
  USER: 'ai_inclusive_user',
  PREFERENCES: 'ai_inclusive_preferences',
  HISTORY: 'ai_inclusive_history',
  STREAK: 'ai_inclusive_streak',
  DAILY_GOAL: 'ai_inclusive_daily_goal',
  ACHIEVEMENTS: 'ai_inclusive_achievements',
  SESSION: 'ai_inclusive_current_session'
};

const DEFAULT_USER = {
  id: 'demo-student-001',
  name: 'Demo Student',
  email: 'student@example.edu',
  category: 'none',
  joinedDate: '2026-10-15',
  dailyGoal: 10,
  isLoggedIn: true
};

const DEFAULT_PREFERENCES = {
  category: 'none',
  fontSize: 'md',        // 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  highContrast: false,
  dyslexiaFont: false,
  lineSpacing: 'normal', // 'normal' | 'relaxed' | 'loose'
  reducedMotion: false,
  readAloud: false,
  speechRate: 1.0,
  oneQuestionAtATime: false,
  breakReminders: true,
  breakInterval: 5,      // questions
  timerEnabled: true,
  immediateFeedback: false
};

// Seed realistic demo history if none exists
const SEED_HISTORY = [
  {
    id: 'rec-101',
    date: '2026-10-20T14:30:00.000Z',
    subjectId: 'math',
    subjectName: 'Mathematics',
    topicId: 'algebra',
    topicName: 'Linear Equations & Expressions',
    totalQuestions: 5,
    score: 4,
    correctCount: 4,
    incorrectCount: 1,
    skippedCount: 0,
    accuracy: 80,
    durationSeconds: 195
  },
  {
    id: 'rec-102',
    date: '2026-10-21T10:15:00.000Z',
    subjectId: 'cs',
    subjectName: 'Computer Science',
    topicId: 'algorithms',
    topicName: 'Sorting & Searching Basics',
    totalQuestions: 5,
    score: 5,
    correctCount: 5,
    incorrectCount: 0,
    skippedCount: 0,
    accuracy: 100,
    durationSeconds: 160
  },
  {
    id: 'rec-103',
    date: '2026-10-22T08:45:00.000Z',
    subjectId: 'english',
    subjectName: 'English',
    topicId: 'reading_comprehension',
    topicName: 'Inference and Main Idea',
    totalQuestions: 5,
    score: 4,
    correctCount: 4,
    incorrectCount: 1,
    skippedCount: 0,
    accuracy: 80,
    durationSeconds: 220
  }
];

class StorageManager {
  constructor() {
    this.init();
  }

  init() {
    try {
      if (!this.get(STORAGE_KEYS.USER)) {
        this.set(STORAGE_KEYS.USER, DEFAULT_USER);
      }
      if (!this.get(STORAGE_KEYS.PREFERENCES)) {
        this.set(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
      }
      if (!this.get(STORAGE_KEYS.HISTORY)) {
        this.set(STORAGE_KEYS.HISTORY, SEED_HISTORY);
      }
      if (!this.get(STORAGE_KEYS.STREAK)) {
        this.set(STORAGE_KEYS.STREAK, {
          currentStreak: 3,
          longestStreak: 5,
          lastActiveDate: '2026-10-22',
          activeDays: ['2026-10-20', '2026-10-21', '2026-10-22']
        });
      }
      if (!this.get(STORAGE_KEYS.DAILY_GOAL)) {
        this.set(STORAGE_KEYS.DAILY_GOAL, {
          target: 10,
          completedToday: 6,
          date: '2026-10-22'
        });
      }
    } catch (e) {
      console.warn('LocalStorage access restricted or not available', e);
    }
  }

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Error reading key ${key} from storage:`, e);
      return null;
    }
  }

  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      console.error(`Error writing key ${key} to storage:`, e);
      return false;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error removing key ${key}:`, e);
      return false;
    }
  }

  // User Profile
  getUser() {
    return this.get(STORAGE_KEYS.USER) || DEFAULT_USER;
  }

  setUser(user) {
    return this.set(STORAGE_KEYS.USER, { ...this.getUser(), ...user });
  }

  // Preferences
  getPreferences() {
    return this.get(STORAGE_KEYS.PREFERENCES) || DEFAULT_PREFERENCES;
  }

  setPreferences(prefs) {
    const current = this.getPreferences();
    return this.set(STORAGE_KEYS.PREFERENCES, { ...current, ...prefs });
  }

  // Learning History
  getHistory() {
    return this.get(STORAGE_KEYS.HISTORY) || [];
  }

  addAssessmentResult(result) {
    const history = this.getHistory();
    history.unshift(result);
    this.set(STORAGE_KEYS.HISTORY, history);

    // Update Daily Goal
    this.incrementDailyGoalProgress(result.totalQuestions || 0);

    // Update Streak
    this.updateStreakActivity();

    return result;
  }

  // Daily Goal
  getDailyGoal() {
    const goal = this.get(STORAGE_KEYS.DAILY_GOAL) || { target: 10, completedToday: 0, date: new Date().toISOString().split('T')[0] };
    const today = new Date().toISOString().split('T')[0];
    if (goal.date !== today) {
      goal.date = today;
      goal.completedToday = 0;
      this.set(STORAGE_KEYS.DAILY_GOAL, goal);
    }
    return goal;
  }

  setDailyGoalTarget(target) {
    const goal = this.getDailyGoal();
    goal.target = parseInt(target, 10) || 10;
    this.set(STORAGE_KEYS.DAILY_GOAL, goal);
    return goal;
  }

  incrementDailyGoalProgress(count) {
    const goal = this.getDailyGoal();
    goal.completedToday = (goal.completedToday || 0) + count;
    this.set(STORAGE_KEYS.DAILY_GOAL, goal);
    return goal;
  }

  // Streak
  getStreak() {
    return this.get(STORAGE_KEYS.STREAK) || { currentStreak: 1, longestStreak: 1, activeDays: [] };
  }

  updateStreakActivity() {
    const today = new Date().toISOString().split('T')[0];
    const streak = this.getStreak();
    if (!streak.activeDays.includes(today)) {
      streak.activeDays.push(today);
      streak.currentStreak = (streak.currentStreak || 0) + 1;
      if (streak.currentStreak > (streak.longestStreak || 0)) {
        streak.longestStreak = streak.currentStreak;
      }
      streak.lastActiveDate = today;
      this.set(STORAGE_KEYS.STREAK, streak);
    }
    return streak;
  }

  // Active Assessment Session
  getSession() {
    return this.get(STORAGE_KEYS.SESSION);
  }

  setSession(session) {
    return this.set(STORAGE_KEYS.SESSION, session);
  }

  clearSession() {
    return this.remove(STORAGE_KEYS.SESSION);
  }

  // Full demo reset
  resetDemoData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      this.set(STORAGE_KEYS.USER, DEFAULT_USER);
      this.set(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
      this.set(STORAGE_KEYS.HISTORY, SEED_HISTORY);
      this.set(STORAGE_KEYS.STREAK, {
        currentStreak: 3,
        longestStreak: 5,
        lastActiveDate: '2026-10-22',
        activeDays: ['2026-10-20', '2026-10-21', '2026-10-22']
      });
      this.set(STORAGE_KEYS.DAILY_GOAL, {
        target: 10,
        completedToday: 6,
        date: '2026-10-22'
      });
      return true;
    } catch (e) {
      console.error('Error resetting demo data:', e);
      return false;
    }
  }
}

// Global singleton instance
window.storage = new StorageManager();

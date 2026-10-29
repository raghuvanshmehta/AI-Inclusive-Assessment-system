/**
 * AI Inclusive Assessment System - Centralized API Service Interface
 * 
 * DESIGNED FOR FUTURE BACKEND & AI MODEL INTEGRATION.
 * In current demo mode, this service routes requests cleanly to local storage & mock repositories.
 * When a real backend (e.g. Node/Express, FastAPI, or Django) is deployed,
 * simply change BACKEND_CONNECTED to true and set API_BASE_URL.
 * 
 * AI MODEL CONTEXT:
 * - Trained on ASSISTments 2012-2013 dataset
 * - Historical Evaluation Metrics: Test AUC ~0.7258, Test Accuracy ~0.73
 * - Features consumed by model: d_problem, d_skill, stu_acc, stu_exp, skill_acc,
 *   skill_exp, recent5, speed, last1, last2, last3, ewm_acc
 * - Target: Predicts student correctness probability on the next problem.
 */

const API_CONFIG = {
  BACKEND_CONNECTED: false, // Set to true when real backend is attached
  API_BASE_URL: 'http://localhost:5000/api', // Example backend URL
  AI_SERVICE_URL: 'http://localhost:5000/api/ai'
};

class ApiService {
  constructor() {
    this.config = API_CONFIG;
  }

  /* ================= Authentication Endpoints ================= */

  async login(email, password) {
    if (this.config.BACKEND_CONNECTED) {
      const response = await fetch(`${this.config.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Authentication failed on server.');
      return await response.json();
    } else {
      // Demo mode fallback
      return await window.auth.login(email, password);
    }
  }

  async register(registrationData) {
    if (this.config.BACKEND_CONNECTED) {
      const response = await fetch(`${this.config.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });
      if (!response.ok) throw new Error('Registration failed on server.');
      return await response.json();
    } else {
      return await window.auth.register(registrationData);
    }
  }

  async logout() {
    if (this.config.BACKEND_CONNECTED) {
      await fetch(`${this.config.API_BASE_URL}/auth/logout`, { method: 'POST' });
    }
    return window.auth.performLogout();
  }

  async getCurrentUser() {
    return window.storage.getUser();
  }

  /* ================= Subjects & Assessments ================= */

  async getSubjects() {
    if (this.config.BACKEND_CONNECTED) {
      const res = await fetch(`${this.config.API_BASE_URL}/subjects`);
      return await res.json();
    }
    return window.subjectsManager.getAllSubjects();
  }

  async getTopics(subjectId) {
    if (this.config.BACKEND_CONNECTED) {
      const res = await fetch(`${this.config.API_BASE_URL}/subjects/${subjectId}/topics`);
      return await res.json();
    }
    return window.subjectsManager.getTopicsBySubject(subjectId);
  }

  async getQuestions(subjectId, topicId, count = 5) {
    if (this.config.BACKEND_CONNECTED) {
      const res = await fetch(`${this.config.API_BASE_URL}/questions?subject=${subjectId}&topic=${topicId}&count=${count}`);
      return await res.json();
    }
    return window.subjectsManager.getQuestions(subjectId, topicId, count);
  }

  async submitAssessment(payload) {
    if (this.config.BACKEND_CONNECTED) {
      const res = await fetch(`${this.config.API_BASE_URL}/assessments/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    }
    return window.storage.addAssessmentResult(payload);
  }

  /* ================= Analytics, Progress & Profile ================= */

  async getProgress(timeframe = 'all', subjectId = 'all') {
    return window.progressManager.calculateMetrics(timeframe, subjectId);
  }

  async getLearningHistory() {
    return window.storage.getHistory();
  }

  async getAchievements() {
    return window.achievementsManager.evaluateAchievements();
  }

  async updatePreferences(preferences) {
    window.storage.setPreferences(preferences);
    window.accessibility.applyPreferences(preferences);
    return preferences;
  }

  async updateProfile(profileUpdates) {
    return window.storage.setUser(profileUpdates);
  }

  /* ================= Future AI Model Integration ================= */

  /**
   * Predict student likelihood of correctness on a prospective question
   * using the trained ASSISTments model (Test AUC ~0.7258).
   * 
   * When connected to backend, sends student history features:
   * { stu_acc, stu_exp, skill_acc, skill_exp, recent5, speed, last1, last2, last3, ewm_acc }
   */
  async getAiPredictiveAssistance(studentId, skillCode) {
    if (this.config.BACKEND_CONNECTED) {
      try {
        const res = await fetch(`${this.config.AI_SERVICE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, skillCode })
        });
        return await res.json();
      } catch (err) {
        console.warn('AI prediction service unavailable:', err);
      }
    }

    // Clearly labeled frontend demonstration response
    return {
      status: 'simulated_preview',
      note: 'Simulated preview. Backend AI model (ASSISTments 2012-2013, AUC 0.7258) not yet connected to a live server endpoint.',
      recommendedTopic: 'Linear Equations & Expressions',
      predictedMasteryConfidence: 0.74,
      adaptiveHintSuggested: true
    };
  }
}

// Global singleton instance
window.api = new ApiService();

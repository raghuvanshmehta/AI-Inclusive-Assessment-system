/**
 * AI Inclusive Assessment System - Accessibility Engine
 * Manages category presets, dynamic theme switching, typography scaling, 
 * reduced motion, speech synthesis (Read-Aloud), and break reminders.
 */

const CATEGORY_PRESETS = {
  none: {
    name: 'No Special Need',
    icon: '👤',
    description: 'Use the standard learning interface while keeping all accessibility options available.',
    defaults: {
      category: 'none',
      fontSize: 'md',
      highContrast: false,
      dyslexiaFont: false,
      lineSpacing: 'normal',
      reducedMotion: false,
      readAloud: false,
      speechRate: 1.0,
      oneQuestionAtATime: false,
      breakReminders: false,
      breakInterval: 10,
      timerEnabled: true,
      immediateFeedback: false
    }
  },
  low_vision: {
    name: 'Low Vision',
    icon: '👁️',
    description: 'Customize the interface for improved readability, contrast, and visual clarity.',
    defaults: {
      category: 'low_vision',
      fontSize: 'xl',
      highContrast: true,
      dyslexiaFont: false,
      lineSpacing: 'relaxed',
      reducedMotion: false,
      readAloud: true,
      speechRate: 1.0,
      oneQuestionAtATime: false,
      breakReminders: true,
      breakInterval: 8,
      timerEnabled: true,
      immediateFeedback: false
    }
  },
  adhd: {
    name: 'ADHD',
    icon: '⚡',
    description: 'Use a focused interface with clear steps and fewer unnecessary distractions.',
    defaults: {
      category: 'adhd',
      fontSize: 'md',
      highContrast: false,
      dyslexiaFont: false,
      lineSpacing: 'normal',
      reducedMotion: true,
      readAloud: false,
      speechRate: 1.0,
      oneQuestionAtATime: true,
      breakReminders: true,
      breakInterval: 5,
      timerEnabled: true,
      immediateFeedback: true
    }
  },
  dyslexia: {
    name: 'Dyslexia',
    icon: '📖',
    description: 'Customize text presentation and spacing to make questions easier to read.',
    defaults: {
      category: 'dyslexia',
      fontSize: 'lg',
      highContrast: false,
      dyslexiaFont: true,
      lineSpacing: 'loose',
      reducedMotion: false,
      readAloud: true,
      speechRate: 0.95,
      oneQuestionAtATime: false,
      breakReminders: true,
      breakInterval: 7,
      timerEnabled: true,
      immediateFeedback: false
    }
  }
};

class AccessibilityManager {
  constructor() {
    this.speechSynthesis = window.speechSynthesis || null;
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.init();
  }

  init() {
    // Immediate application of stored preferences
    const prefs = window.storage ? window.storage.getPreferences() : CATEGORY_PRESETS.none.defaults;
    this.applyPreferences(prefs);
  }

  getPresets() {
    return CATEGORY_PRESETS;
  }

  getCurrentCategory() {
    const prefs = window.storage ? window.storage.getPreferences() : {};
    return prefs.category || 'none';
  }

  applyCategoryPreset(categoryKey) {
    const preset = CATEGORY_PRESETS[categoryKey] || CATEGORY_PRESETS.none;
    const newPrefs = { ...preset.defaults };
    if (window.storage) {
      window.storage.setPreferences(newPrefs);
      const user = window.storage.getUser();
      user.category = categoryKey;
      window.storage.setUser(user);
    }
    this.applyPreferences(newPrefs);
    return newPrefs;
  }

  applyPreferences(prefs) {
    if (!prefs) return;
    const body = document.body;
    if (!body) return;

    // High Contrast
    if (prefs.highContrast) {
      body.classList.add('theme-high-contrast');
    } else {
      body.classList.remove('theme-high-contrast');
    }

    // Dyslexia Typography
    if (prefs.dyslexiaFont) {
      body.classList.add('theme-dyslexia');
    } else {
      body.classList.remove('theme-dyslexia');
    }

    // ADHD Focused Theme
    if (prefs.category === 'adhd' || prefs.oneQuestionAtATime) {
      body.classList.add('theme-adhd');
    } else {
      body.classList.remove('theme-adhd');
    }

    // Font Size
    body.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg', 'text-size-xl', 'text-size-2xl');
    body.classList.add(`text-size-${prefs.fontSize || 'md'}`);

    // Reduced Motion
    if (prefs.reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }

    // Dispatch event so active components can adapt (e.g. charts, question palette)
    window.dispatchEvent(new CustomEvent('accessibilityChanged', { detail: prefs }));
  }

  updateSinglePreference(key, value) {
    if (!window.storage) return;
    const current = window.storage.getPreferences();
    current[key] = value;
    window.storage.setPreferences(current);
    this.applyPreferences(current);
  }

  /* ================= Speech Synthesis (Read-Aloud) ================= */

  isSpeechSupported() {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  speak(text, onStart = null, onEnd = null) {
    if (!this.isSpeechSupported()) {
      alert('Speech synthesis is not supported by your current browser.');
      return;
    }

    this.stopSpeaking();

    if (!text || text.trim() === '') return;

    const prefs = window.storage ? window.storage.getPreferences() : {};
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = prefs.speechRate || 1.0;
    utterance.pitch = 1.0;

    // Pick a clean, natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && !v.name.includes('Google'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (typeof onStart === 'function') onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (typeof onEnd === 'function') onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (typeof onEnd === 'function') onEnd();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.isSpeechSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }
}

// Global singleton instance
window.accessibility = new AccessibilityManager();

// Automatically apply preferences as soon as DOM loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.accessibility.init());
} else {
  window.accessibility.init();
}

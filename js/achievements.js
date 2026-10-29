/**
 * AI Inclusive Assessment System - Achievements & Gamification Engine
 * Evaluates student achievements dynamically from demo learning history and activity.
 */

const ACHIEVEMENTS_LIST = [
  {
    id: 'first_steps',
    name: 'First Steps',
    icon: '🌱',
    description: 'Complete your first practice assessment on the platform.',
    unlockCondition: 'Complete 1 assessment',
    target: 1,
    category: 'Milestone'
  },
  {
    id: 'getting_consistent',
    name: 'Getting Consistent',
    icon: '🔥',
    description: 'Practise on three separate days to establish a routine.',
    unlockCondition: 'Active on 3 different days',
    target: 3,
    category: 'Consistency'
  },
  {
    id: 'week_of_learning',
    name: 'Week of Learning',
    icon: '⚡',
    description: 'Maintain practice activity across 7 calendar days.',
    unlockCondition: 'Active on 7 different days',
    target: 7,
    category: 'Consistency'
  },
  {
    id: 'accuracy_builder',
    name: 'Accuracy Builder',
    icon: '🎯',
    description: 'Achieve 80% or higher accuracy across completed assessments.',
    unlockCondition: 'Attain >= 80% overall accuracy',
    target: 80,
    category: 'Mastery'
  },
  {
    id: 'subject_explorer',
    name: 'Subject Explorer',
    icon: '🧭',
    description: 'Explore and practise questions across at least 3 distinct subjects.',
    unlockCondition: 'Practise in 3 subjects',
    target: 3,
    category: 'Exploration'
  },
  {
    id: 'persistent_learner',
    name: 'Persistent Learner',
    icon: '🏆',
    description: 'Answer at least 25 questions across all learning sessions.',
    unlockCondition: 'Attempt 25 questions',
    target: 25,
    category: 'Dedication'
  },
  {
    id: 'inclusive_pioneer',
    name: 'Inclusive Pioneer',
    icon: '🌟',
    description: 'Customize or personalize your accessibility preferences.',
    unlockCondition: 'Explore accessibility options',
    target: 1,
    category: 'Accessibility'
  }
];

class AchievementsManager {
  constructor() {
    this.storage = window.storage;
    this.achievements = ACHIEVEMENTS_LIST;
  }

  evaluateAchievements() {
    const history = this.storage ? this.storage.getHistory() : [];
    const streak = this.storage ? this.storage.getStreak() : { activeDays: [] };
    const prefs = this.storage ? this.storage.getPreferences() : {};

    // 1. Total assessments completed
    const totalAssessments = history.length;

    // 2. Distinct active days
    const activeDaysCount = streak.activeDays ? streak.activeDays.length : 1;

    // 3. Overall Accuracy
    let totalQ = 0;
    let totalC = 0;
    history.forEach(item => {
      totalQ += (item.totalQuestions || 0);
      totalC += (item.correctCount || 0);
    });
    const overallAccuracy = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

    // 4. Distinct subjects
    const uniqueSubjects = new Set(history.map(item => item.subjectId)).size;

    // 5. Total questions attempted
    const totalQuestionsAttempted = totalQ;

    // 6. Accessibility customized
    const hasCustomizedAccessibility = prefs.category !== 'none' || prefs.highContrast || prefs.dyslexiaFont || prefs.fontSize !== 'md';

    return this.achievements.map(ach => {
      let currentProgress = 0;
      let isUnlocked = false;

      switch (ach.id) {
        case 'first_steps':
          currentProgress = totalAssessments;
          isUnlocked = totalAssessments >= ach.target;
          break;
        case 'getting_consistent':
          currentProgress = activeDaysCount;
          isUnlocked = activeDaysCount >= ach.target;
          break;
        case 'week_of_learning':
          currentProgress = activeDaysCount;
          isUnlocked = activeDaysCount >= ach.target;
          break;
        case 'accuracy_builder':
          currentProgress = overallAccuracy;
          isUnlocked = totalQ >= 5 && overallAccuracy >= ach.target;
          break;
        case 'subject_explorer':
          currentProgress = uniqueSubjects;
          isUnlocked = uniqueSubjects >= ach.target;
          break;
        case 'persistent_learner':
          currentProgress = totalQuestionsAttempted;
          isUnlocked = totalQuestionsAttempted >= ach.target;
          break;
        case 'inclusive_pioneer':
          currentProgress = hasCustomizedAccessibility ? 1 : 0;
          isUnlocked = hasCustomizedAccessibility;
          break;
        default:
          break;
      }

      const percent = Math.min(100, Math.round((currentProgress / ach.target) * 100));

      return {
        ...ach,
        currentProgress,
        progressPercent: percent,
        isUnlocked
      };
    });
  }
}

// Global singleton instance
window.achievementsManager = new AchievementsManager();

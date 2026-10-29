/**
 * AI Inclusive Assessment System - Assessment Session & Interaction Engine
 * Manages question flow, answer selection, accessible timers, speech synthesis,
 * flag/skip status, ADHD focus mode, break reminders, and submission.
 */

class AssessmentEngine {
  constructor() {
    this.storage = window.storage;
    this.subjectsManager = window.subjectsManager;
    this.accessibility = window.accessibility;

    this.subjectId = null;
    this.topicId = null;
    this.questions = [];
    this.currentIndex = 0;
    this.userAnswers = []; // { selectedIndex, isSkipped, isFlagged }
    this.timerSeconds = 0;
    this.timerInterval = null;
    this.timerActive = true;
    this.startTime = null;
    this.questionsCompletedCount = 0;

    this.dom = {};
  }

  init(subjectId, topicId, count = 5, timed = true) {
    this.subjectId = subjectId || 'math';
    this.topicId = topicId || 'algebra';
    
    const subject = this.subjectsManager.getSubjectById(this.subjectId);
    const topic = this.subjectsManager.getTopicById(this.subjectId, this.topicId);
    
    this.questions = this.subjectsManager.getQuestions(this.subjectId, this.topicId, count);
    if (!this.questions || this.questions.length === 0) {
      alert('No questions found for this topic.');
      window.location.href = 'subjects.html';
      return;
    }

    // Initialize answer states
    this.userAnswers = this.questions.map(q => ({
      questionId: q.id,
      selectedIndex: null,
      isSkipped: false,
      isFlagged: false
    }));

    this.currentIndex = 0;
    this.startTime = Date.now();

    // Set timer: default ~ 2 minutes per question
    const prefs = this.accessibility ? this.accessibility.getCurrentCategory() : 'none';
    const baseMinutes = Math.max(5, count * 2);
    this.timerSeconds = timed ? baseMinutes * 60 : 0;
    this.timerActive = timed;

    this.cacheDOM();
    this.renderHeader(subject, topic);
    this.renderPalette();
    this.renderCurrentQuestion();
    this.bindEvents();

    if (this.timerActive) {
      this.startTimer();
    } else {
      if (this.dom.timerContainer) this.dom.timerContainer.style.display = 'none';
    }

    // Apply focus mode if ADHD category or user enabled
    const userPrefs = this.storage ? this.storage.getPreferences() : {};
    if (userPrefs.category === 'adhd' || userPrefs.oneQuestionAtATime) {
      const bodyContainer = document.querySelector('.assessment-body');
      if (bodyContainer) bodyContainer.classList.add('focus-mode');
    }
  }

  cacheDOM() {
    this.dom.subjectName = document.getElementById('assessmentSubject');
    this.dom.topicName = document.getElementById('assessmentTopic');
    this.dom.progressText = document.getElementById('assessmentProgressText');
    this.dom.progressBarFill = document.getElementById('assessmentProgressFill');
    this.dom.timerContainer = document.getElementById('assessmentTimer');
    this.dom.timerDisplay = document.getElementById('timerDisplay');
    
    this.dom.questionIndicator = document.getElementById('questionIndicator');
    this.dom.questionText = document.getElementById('questionText');
    this.dom.optionsContainer = document.getElementById('optionsContainer');
    this.dom.paletteGrid = document.getElementById('paletteGrid');
    
    this.dom.btnPrev = document.getElementById('btnPrevQuestion');
    this.dom.btnNext = document.getElementById('btnNextQuestion');
    this.dom.btnSkip = document.getElementById('btnSkipQuestion');
    this.dom.btnFlag = document.getElementById('btnFlagQuestion');
    this.dom.btnSubmit = document.getElementById('btnSubmitAssessment');
    this.dom.btnExit = document.getElementById('btnExitAssessment');
    
    this.dom.btnReadAloud = document.getElementById('btnReadAloud');
    this.dom.btnStopSpeech = document.getElementById('btnStopSpeech');
  }

  renderHeader(subject, topic) {
    if (this.dom.subjectName) this.dom.subjectName.textContent = subject ? subject.name : 'Assessment';
    if (this.dom.topicName) this.dom.topicName.textContent = topic ? topic.name : 'Topic Practice';
  }

  renderCurrentQuestion() {
    const q = this.questions[this.currentIndex];
    const ans = this.userAnswers[this.currentIndex];
    const total = this.questions.length;

    // Stop ongoing speech
    if (this.accessibility) this.accessibility.stopSpeaking();
    if (this.dom.btnReadAloud) this.dom.btnReadAloud.classList.remove('speaking');

    // Update Progress
    const answeredCount = this.userAnswers.filter(a => a.selectedIndex !== null).length;
    const progressPercent = Math.round(((this.currentIndex + 1) / total) * 100);
    
    if (this.dom.progressText) {
      this.dom.progressText.textContent = `Question ${this.currentIndex + 1} of ${total} • ${answeredCount} answered`;
    }
    if (this.dom.progressBarFill) {
      this.dom.progressBarFill.style.width = `${progressPercent}%`;
    }

    // Question number & text
    if (this.dom.questionIndicator) {
      this.dom.questionIndicator.textContent = `Question ${this.currentIndex + 1} of ${total} (${q.difficulty || 'Standard'})`;
    }
    if (this.dom.questionText) {
      this.dom.questionText.textContent = q.question;
    }

    // Render Options
    if (this.dom.optionsContainer) {
      this.dom.optionsContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];
      
      q.options.forEach((optText, idx) => {
        const optionEl = document.createElement('div');
        optionEl.className = `option-choice ${ans.selectedIndex === idx ? 'selected' : ''}`;
        optionEl.setAttribute('role', 'radio');
        optionEl.setAttribute('aria-checked', ans.selectedIndex === idx ? 'true' : 'false');
        optionEl.setAttribute('tabindex', '0');
        optionEl.dataset.index = idx;

        optionEl.innerHTML = `
          <div class="option-letter" aria-hidden="true">${letters[idx]}</div>
          <div class="option-text">${optText}</div>
        `;

        optionEl.addEventListener('click', () => this.selectAnswer(idx));
        optionEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.selectAnswer(idx);
          }
        });

        this.dom.optionsContainer.appendChild(optionEl);
      });
    }

    // Update Button States
    if (this.dom.btnPrev) {
      this.dom.btnPrev.disabled = this.currentIndex === 0;
    }
    if (this.dom.btnNext) {
      this.dom.btnNext.style.display = this.currentIndex === total - 1 ? 'none' : 'inline-flex';
    }
    if (this.dom.btnSubmit) {
      this.dom.btnSubmit.style.display = this.currentIndex === total - 1 ? 'inline-flex' : 'none';
    }

    // Flag button state
    if (this.dom.btnFlag) {
      if (ans.isFlagged) {
        this.dom.btnFlag.classList.add('btn-warning');
        this.dom.btnFlag.innerHTML = '🚩 Flagged';
      } else {
        this.dom.btnFlag.classList.remove('btn-warning');
        this.dom.btnFlag.innerHTML = '🏳️ Flag for Review';
      }
    }

    this.renderPalette();
  }

  renderPalette() {
    if (!this.dom.paletteGrid) return;
    this.dom.paletteGrid.innerHTML = '';

    this.questions.forEach((q, idx) => {
      const ans = this.userAnswers[idx];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'palette-btn';
      btn.textContent = idx + 1;
      btn.setAttribute('aria-label', `Question ${idx + 1}`);

      if (idx === this.currentIndex) btn.classList.add('current');
      if (ans.selectedIndex !== null) btn.classList.add('answered');
      if (ans.isFlagged) btn.classList.add('flagged');

      btn.addEventListener('click', () => this.goToQuestion(idx));
      this.dom.paletteGrid.appendChild(btn);
    });
  }

  selectAnswer(index) {
    this.userAnswers[this.currentIndex].selectedIndex = index;
    this.userAnswers[this.currentIndex].isSkipped = false;
    this.renderCurrentQuestion();

    // Check for break reminder preference (e.g. ADHD preference)
    this.checkBreakReminder();
  }

  checkBreakReminder() {
    const prefs = this.storage ? this.storage.getPreferences() : {};
    if (prefs.breakReminders) {
      const answeredCount = this.userAnswers.filter(a => a.selectedIndex !== null).length;
      const interval = prefs.breakInterval || 5;
      if (answeredCount > 0 && answeredCount % interval === 0 && !this.userAnswers[this.currentIndex].breakTriggered) {
        this.userAnswers[this.currentIndex].breakTriggered = true;
        this.showBreakReminderModal(answeredCount);
      }
    }
  }

  showBreakReminderModal(count) {
    let modal = document.getElementById('breakModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'breakModal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-dialog text-center" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3 class="modal-title">🌿 Quick Recharge Break</h3>
          </div>
          <div class="modal-body">
            <p style="font-size: 1.1rem; color: var(--text-main); font-weight: 600;">
              Awesome job! You have answered ${count} questions.
            </p>
            <p>
              Take 30 seconds to relax your eyes, stretch your neck and shoulders, or take a deep breath.
              Pacing yourself improves focus and retention.
            </p>
          </div>
          <div class="modal-footer justify-center">
            <button type="button" class="btn btn-primary" id="btnResumeBreak">I'm Ready to Continue</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector('#btnResumeBreak').addEventListener('click', () => {
        modal.classList.remove('show');
      });
    }
    modal.classList.add('show');
  }

  goToQuestion(index) {
    if (index >= 0 && index < this.questions.length) {
      this.currentIndex = index;
      this.renderCurrentQuestion();
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.renderCurrentQuestion();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCurrentQuestion();
    }
  }

  skipQuestion() {
    this.userAnswers[this.currentIndex].isSkipped = true;
    this.nextQuestion();
  }

  toggleFlag() {
    const ans = this.userAnswers[this.currentIndex];
    ans.isFlagged = !ans.isFlagged;
    this.renderCurrentQuestion();
  }

  readCurrentQuestion() {
    if (!this.accessibility) return;
    const q = this.questions[this.currentIndex];
    const letters = ['Option A', 'Option B', 'Option C', 'Option D'];
    let textToRead = `Question ${this.currentIndex + 1}. ${q.question}. `;
    q.options.forEach((opt, i) => {
      textToRead += `${letters[i]}: ${opt}. `;
    });

    if (this.dom.btnReadAloud) this.dom.btnReadAloud.classList.add('speaking');
    this.accessibility.speak(textToRead, null, () => {
      if (this.dom.btnReadAloud) this.dom.btnReadAloud.classList.remove('speaking');
    });
  }

  stopReading() {
    if (this.accessibility) this.accessibility.stopSpeaking();
    if (this.dom.btnReadAloud) this.dom.btnReadAloud.classList.remove('speaking');
  }

  startTimer() {
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        this.updateTimerDisplay();

        if (this.timerSeconds <= 60 && this.dom.timerContainer) {
          this.dom.timerContainer.classList.add('timer-warning');
        }
      } else {
        clearInterval(this.timerInterval);
        alert('Time is up! Submitting your assessment now.');
        this.submitAssessment(true);
      }
    }, 1000);
  }

  updateTimerDisplay() {
    if (!this.dom.timerDisplay) return;
    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    this.dom.timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  bindEvents() {
    if (this.dom.btnPrev) this.dom.btnPrev.addEventListener('click', () => this.prevQuestion());
    if (this.dom.btnNext) this.dom.btnNext.addEventListener('click', () => this.nextQuestion());
    if (this.dom.btnSkip) this.dom.btnSkip.addEventListener('click', () => this.skipQuestion());
    if (this.dom.btnFlag) this.dom.btnFlag.addEventListener('click', () => this.toggleFlag());
    if (this.dom.btnSubmit) this.dom.btnSubmit.addEventListener('click', () => this.showSubmitConfirmation());
    if (this.dom.btnExit) this.dom.btnExit.addEventListener('click', () => this.showExitConfirmation());

    if (this.dom.btnReadAloud) this.dom.btnReadAloud.addEventListener('click', () => this.readCurrentQuestion());
    if (this.dom.btnStopSpeech) this.dom.btnStopSpeech.addEventListener('click', () => this.stopReading());

    // Accessible Keyboard Shortcuts (1-4 for options, Enter for next)
    document.addEventListener('keydown', (e) => {
      // Avoid firing when modal is open
      if (document.querySelector('.modal-backdrop.show')) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < this.questions[this.currentIndex].options.length) {
          this.selectAnswer(idx);
        }
      } else if (e.key === 'ArrowRight' || (e.key === 'n' && e.altKey)) {
        this.nextQuestion();
      } else if (e.key === 'ArrowLeft' || (e.key === 'p' && e.altKey)) {
        this.prevQuestion();
      }
    });
  }

  showExitConfirmation() {
    let modal = document.getElementById('exitModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'exitModal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3 class="modal-title">Exit Assessment?</h3>
            <button type="button" class="btn-close" id="btnCancelExitTop">&times;</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to exit? Your answers for this attempt will not be recorded in your learning history.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="btnCancelExit">Continue Practising</button>
            <button type="button" class="btn btn-danger" id="btnConfirmExit">Exit to Subjects</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const close = () => modal.classList.remove('show');
      modal.querySelector('#btnCancelExit').addEventListener('click', close);
      modal.querySelector('#btnCancelExitTop').addEventListener('click', close);
      modal.querySelector('#btnConfirmExit').addEventListener('click', () => {
        if (this.timerInterval) clearInterval(this.timerInterval);
        window.location.href = 'subjects.html';
      });
    }
    modal.classList.add('show');
  }

  showSubmitConfirmation() {
    const answeredCount = this.userAnswers.filter(a => a.selectedIndex !== null).length;
    const totalCount = this.questions.length;
    const flaggedCount = this.userAnswers.filter(a => a.isFlagged).length;
    const unansweredCount = totalCount - answeredCount;

    let modal = document.getElementById('submitModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'submitModal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3 class="modal-title">Submit Assessment</h3>
            <button type="button" class="btn-close" id="btnCancelSubmitTop">&times;</button>
          </div>
          <div class="modal-body" id="submitModalBody">
            <!-- Dynamic summary inserted here -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="btnCancelSubmit">Review Answers</button>
            <button type="button" class="btn btn-primary" id="btnConfirmSubmit">Confirm & View Results</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const close = () => modal.classList.remove('show');
      modal.querySelector('#btnCancelSubmit').addEventListener('click', close);
      modal.querySelector('#btnCancelSubmitTop').addEventListener('click', close);
      modal.querySelector('#btnConfirmSubmit').addEventListener('click', () => {
        close();
        this.submitAssessment(false);
      });
    }

    const bodyEl = modal.querySelector('#submitModalBody');
    bodyEl.innerHTML = `
      <p style="margin-bottom: 0.75rem;">Are you ready to submit your assessment?</p>
      <ul style="font-size: 0.875rem; margin-bottom: 1rem;">
        <li>Answered: <strong>${answeredCount} of ${totalCount}</strong> questions</li>
        ${unansweredCount > 0 ? `<li style="color: var(--color-warning);">Unanswered: <strong>${unansweredCount}</strong></li>` : ''}
        ${flaggedCount > 0 ? `<li>Flagged for review: <strong>${flaggedCount}</strong></li>` : ''}
      </ul>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0;">
        Results and detailed question explanations will be calculated immediately.
      </p>
    `;

    modal.classList.add('show');
  }

  submitAssessment(force = false) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.accessibility) this.accessibility.stopSpeaking();

    const durationSeconds = Math.round((Date.now() - this.startTime) / 1000);
    const subject = this.subjectsManager.getSubjectById(this.subjectId);
    const topic = this.subjectsManager.getTopicById(this.subjectId, this.topicId);

    // Calculate score
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    const detailedAnswers = this.questions.map((q, idx) => {
      const ans = this.userAnswers[idx];
      const selected = ans.selectedIndex;
      let status = 'skipped';

      if (selected === null || ans.isSkipped) {
        skippedCount++;
        status = 'skipped';
      } else if (selected === q.correctIndex) {
        correctCount++;
        status = 'correct';
      } else {
        incorrectCount++;
        status = 'incorrect';
      }

      return {
        questionId: q.id,
        questionText: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        userSelectedIndex: selected,
        explanation: q.explanation,
        status: status,
        difficulty: q.difficulty
      };
    });

    const totalQuestions = this.questions.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const resultRecord = {
      id: `res-${Date.now()}`,
      date: new Date().toISOString(),
      subjectId: this.subjectId,
      subjectName: subject ? subject.name : 'Mathematics',
      topicId: this.topicId,
      topicName: topic ? topic.name : 'Linear Equations',
      totalQuestions: totalQuestions,
      score: correctCount,
      correctCount: correctCount,
      incorrectCount: incorrectCount,
      skippedCount: skippedCount,
      accuracy: accuracy,
      durationSeconds: durationSeconds,
      answers: detailedAnswers
    };

    // Store in history
    if (this.storage) {
      this.storage.addAssessmentResult(resultRecord);
      this.storage.set('ai_inclusive_latest_result', resultRecord);
    }

    // Redirect to results view
    window.location.href = `results.html?id=${resultRecord.id}`;
  }
}

// Global singleton instance
window.assessmentEngine = new AssessmentEngine();

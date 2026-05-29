(function () {
  const STORAGE_KEY = 'ege-inf-2026-progress';
  const VERSION = 1;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { version: VERSION, tasks: {}, solutions: {} };
      const data = JSON.parse(raw);
      return { version: VERSION, tasks: data.tasks || {}, solutions: data.solutions || {} };
    } catch {
      return { version: VERSION, tasks: {}, solutions: {} };
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  const EgeProgress = {
    isTheoryDone(taskId) {
      return !!load().tasks[taskId]?.theory;
    },

    setTheory(taskId, done) {
      const data = load();
      if (!data.tasks[taskId]) data.tasks[taskId] = {};
      data.tasks[taskId].theory = done;
      data.tasks[taskId].updatedAt = new Date().toISOString().slice(0, 10);
      save(data);
      this.refreshChips();
    },

    isSolutionDone(key) {
      return !!load().solutions[key];
    },

    setSolution(key, done) {
      const data = load();
      if (done) data.solutions[key] = true;
      else delete data.solutions[key];
      save(data);
    },

    applySolutionMarks() {
      document.querySelectorAll('[data-solution-id]').forEach((el) => {
        const key = el.getAttribute('data-solution-id');
        if (key && this.isSolutionDone(key)) el.classList.add('done');
        else el.classList.remove('done');
      });
      document.querySelectorAll('[data-task-id]').forEach((el) => {
        const taskId = el.getAttribute('data-task-id');
        if (taskId && this.isTheoryDone(taskId)) el.classList.add('done');
      });
    },

    refreshChips() {
      this.applySolutionMarks();
    },

    updateDashboard(totalTasks, totalSolutions) {
      const data = load();
      const tasksDone = Object.values(data.tasks).filter((t) => t.theory).length;
      const solutionsDone = Object.keys(data.solutions).length;
      const total = totalTasks + totalSolutions;
      const done = tasksDone + solutionsDone;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;

      const elTasks = document.getElementById('stat-tasks');
      const elSols = document.getElementById('stat-solutions');
      const elBar = document.getElementById('overall-progress');
      const elLabel = document.getElementById('overall-progress-label');

      if (elTasks) elTasks.textContent = String(tasksDone);
      if (elSols) elSols.textContent = String(solutionsDone);
      if (elBar) elBar.style.width = pct + '%';
      if (elLabel) elLabel.textContent = pct + '%';

      this.applySolutionMarks();
    },
  };

  window.EgeProgress = EgeProgress;

  document.addEventListener('DOMContentLoaded', () => {
    EgeProgress.applySolutionMarks();
  });
})();

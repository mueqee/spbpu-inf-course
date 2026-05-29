/// <reference types="astro/client" />

interface EgeProgressAPI {
  isTheoryDone(taskId: string): boolean;
  setTheory(taskId: string, done: boolean): void;
  isSolutionDone(key: string): boolean;
  setSolution(key: string, done: boolean): void;
  applySolutionMarks(): void;
  refreshChips(): void;
  updateDashboard(totalTasks: number, totalSolutions: number): void;
}

declare global {
  interface Window {
    EgeProgress?: EgeProgressAPI;
  }
}

export {};

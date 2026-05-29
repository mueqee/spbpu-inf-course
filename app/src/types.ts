export interface Solution {
  id: string;
  file: string;
  docstring: string;
  answer: string | null;
  code: string;
  dataFiles: { name: string; url: string }[];
}

export interface Task {
  id: string;
  folder: string;
  title: string;
  hasTheory: boolean;
  theoryMarkdown: string;
  solutions: Solution[];
  githubUrl: string;
}

export interface Block {
  id: string;
  title: string;
  description: string;
  taskIds: string[];
}

export interface ExternalCourse {
  id: string;
  title: string;
  author: string;
  platform: string;
  type: string;
  url: string;
  description: string;
}

export interface ContentIndex {
  generatedAt: string;
  meta: { title: string; subtitle: string };
  blocks: Block[];
  tasks: Task[];
  externalCourses: ExternalCourse[];
  stats: { taskCount: number; solutionCount: number; theoryCount: number };
}

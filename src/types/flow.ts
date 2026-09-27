export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  projectId: number | null;
};

export type Project = {
  id: number;
  title: string;
  goal: string;
};
import { createContext } from "react";

import type { Project, Task } from "../types/flow";

export type FlowContextType = {
  tasks: Task[];

  projects: Project[];

loading: boolean;
error: string | null;
refreshData: () => Promise<void>;
addTask: (
  title: string,
  description?: string,
  projectId?: number | null
) => Promise<void>;

addProject: (
  title: string,
  goal?: string
) => Promise<void>;

updateProject: (
  id: number,
  title: string,
  goal?: string
) => Promise<void>;

toggleTask: (
  id: number
) => Promise<void>;

updateTask: (
  id: number,
  title: string,
  description?: string,
  projectId?: number | null
) => Promise<void>;

deleteTask: (
  id: number
) => Promise<void>;

deleteProject: (
  id: number
) => Promise<void>;}
export const FlowContext =
  createContext<FlowContextType | undefined>(
    undefined
  );
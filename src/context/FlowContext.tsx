import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { FlowContext } from "./FlowContextContext";
import type { Project, Task } from "../types/flow";
import { supabase } from "../lib/supabase";

function FlowProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setTasks([]);
          setProjects([]);
          return;
        }

        const [
          { data: projectData, error: projectError },
          { data: taskData, error: taskError },
        ] = await Promise.all([
          supabase
            .from("projects")
            .select("id, title, goal")
            .eq("user_id", user.id)
            .order("created_at", {
              ascending: false,
            }),

          supabase
            .from("tasks")
            .select(
              "id, title, description, completed, project_id"
            )
            .eq("user_id", user.id)
            .order("created_at", {
              ascending: false,
            }),
        ]);

        if (projectError) {
          throw projectError;
        }

        if (taskError) {
          throw taskError;
        }

        setProjects(
          (projectData ?? []).map((project) => ({
            id: project.id,
            title: project.title,
            goal: project.goal ?? "",
          }))
        );

        setTasks(
          (taskData ?? []).map((task) => ({
            id: task.id,
            title: task.title,
            description:
              task.description ?? "",
            completed:
              task.completed ?? false,
            projectId: task.project_id,
          }))
        );
      } catch (error) {
        console.error(
          "Error loading FLOW data:",
          error
        );

        setError(
          "تعذر تحميل بيانات FLOW. تحقق من اتصال الإنترنت وحاول مرة أخرى"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setTimeout(() => {
            loadData();
          }, 0);
        } else {
          setTasks([]);
          setProjects([]);
          setError(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setTasks([]);
        setProjects([]);
        return;
      }

      const [
        { data: projectData, error: projectError },
        { data: taskData, error: taskError },
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("id, title, goal")
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("tasks")
          .select(
            "id, title, description, completed, project_id"
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (projectError) {
        throw projectError;
      }

      if (taskError) {
        throw taskError;
      }

      setProjects(
        (projectData ?? []).map((project) => ({
          id: project.id,
          title: project.title,
          goal: project.goal ?? "",
        }))
      );

      setTasks(
        (taskData ?? []).map((task) => ({
          id: task.id,
          title: task.title,
          description:
            task.description ?? "",
          completed:
            task.completed ?? false,
          projectId: task.project_id,
        }))
      );
    } catch (error) {
      console.error(
        "Error refreshing FLOW data:",
        error
      );

      setError(
        "تعذر تحميل بيانات FLOW. تحقق من اتصال الإنترنت وحاول مرة أخرى"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(
    async (
      title: string,
      description = "",
      projectId: number | null = null
    ) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const cleanTitle = title.trim();
      const cleanDescription =
        description.trim();

      if (!cleanTitle) return;

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          title: cleanTitle,
          description: cleanDescription,
          completed: false,
          project_id: projectId,
        })
        .select(
          "id, title, description, completed, project_id"
        )
        .single();

      if (error) {
        console.error(
          "Error adding task:",
          error
        );
        return;
      }

      const newTask: Task = {
        id: data.id,
        title: data.title,
        description:
          data.description ?? "",
        completed:
          data.completed ?? false,
        projectId: data.project_id,
      };

      setTasks((current) => [
        newTask,
        ...current,
      ]);
    },
    []
  );

  const addProject = useCallback(
    async (
      title: string,
      goal = ""
    ) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const cleanTitle = title.trim();
      const cleanGoal = goal.trim();

      if (!cleanTitle) return;

      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title: cleanTitle,
          goal: cleanGoal,
        })
        .select("id, title, goal")
        .single();

      if (error) {
        console.error(
          "Error adding project:",
          error
        );
        return;
      }

      const newProject: Project = {
        id: data.id,
        title: data.title,
        goal: data.goal ?? "",
      };

      setProjects((current) => [
        newProject,
        ...current,
      ]);
    },
    []
  );

  const updateProject = useCallback(
    async (
      id: number,
      title: string,
      goal = ""
    ) => {
      const cleanTitle = title.trim();
      const cleanGoal = goal.trim();

      if (!cleanTitle) return;

      const { data, error } =
        await supabase
          .from("projects")
          .update({
            title: cleanTitle,
            goal: cleanGoal,
          })
          .eq("id", id)
          .select("id, title, goal")
          .single();

      if (error) {
        console.error(
          "Error updating project:",
          error
        );
        return;
      }

      setProjects((current) =>
        current.map((project) =>
          project.id === id
            ? {
                id: data.id,
                title: data.title,
                goal: data.goal ?? "",
              }
            : project
        )
      );
    },
    []
  );

  const toggleTask = useCallback(
    async (id: number) => {
      const task = tasks.find(
        (item) => item.id === id
      );

      if (!task) return;

      const { error } = await supabase
        .from("tasks")
        .update({
          completed: !task.completed,
        })
        .eq("id", id);

      if (error) {
        console.error(
          "Error updating task:",
          error
        );
        return;
      }

      setTasks((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                completed:
                  !item.completed,
              }
            : item
        )
      );
    },
    [tasks]
  );

  const updateTask = useCallback(
    async (
      id: number,
      title: string,
      description = "",
      projectId: number | null = null
    ) => {
      const cleanTitle = title.trim();
      const cleanDescription =
        description.trim();

      if (!cleanTitle) return;

      const { data, error } =
        await supabase
          .from("tasks")
          .update({
            title: cleanTitle,
            description:
              cleanDescription,
            project_id: projectId,
          })
          .eq("id", id)
          .select(
            "id, title, description, completed, project_id"
          )
          .single();

      if (error) {
        console.error(
          "Error updating task:",
          error
        );
        return;
      }

      setTasks((current) =>
        current.map((task) =>
          task.id === id
            ? {
                id: data.id,
                title: data.title,
                description:
                  data.description ?? "",
                completed:
                  data.completed ?? false,
                projectId:
                  data.project_id,
              }
            : task
        )
      );
    },
    []
  );

  const deleteTask = useCallback(
    async (id: number) => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(
          "Error deleting task:",
          error
        );
        return;
      }

      setTasks((current) =>
        current.filter(
          (task) => task.id !== id
        )
      );
    },
    []
  );

  const deleteProject = useCallback(
    async (id: number) => {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(
          "Error deleting project:",
          error
        );
        return;
      }

      setProjects((current) =>
        current.filter(
          (project) =>
            project.id !== id
        )
      );

      setTasks((current) =>
        current.map((task) =>
          task.projectId === id
            ? {
                ...task,
                projectId: null,
              }
            : task
        )
      );
    },
    []
  );

  const value = useMemo(
    () => ({
      tasks,
      projects,
      loading,
      error,
      refreshData,
      addTask,
      addProject,
      updateProject,
      toggleTask,
      updateTask,
      deleteTask,
      deleteProject,
    }),
    [
      tasks,
      projects,
      loading,
      error,
      refreshData,
      addTask,
      addProject,
      updateProject,
      toggleTask,
      updateTask,
      deleteTask,
      deleteProject,
    ]
  );

  return (
    <FlowContext.Provider value={value}>
      {children}
    </FlowContext.Provider>
  );
}

export default FlowProvider;
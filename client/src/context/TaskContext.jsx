import { createContext, useContext, useState, useCallback } from "react";
import { tasksApi } from "../services/api";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tasksApi.getAll(params);
      setTasks(response.tasks);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    const newTask = await tasksApi.create(taskData);
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = async (id, taskData) => {
    // Optimistic update
    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...taskData } : t)),
    );

    try {
      const updatedTask = await tasksApi.update(id, taskData);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        pagination,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
}

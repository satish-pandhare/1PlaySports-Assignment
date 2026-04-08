import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import Pagination from "../components/Pagination";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { tasks, loading, error, fetchTasks, pagination } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTasks({
      status: statusFilter || undefined,
      page: currentPage,
      limit: 10,
    });
  }, [fetchTasks, statusFilter, currentPage]);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const filters = [
    { value: "", label: "All" },
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-14">
          {/* App Name */}
          <span className="text-sm font-semibold text-neutral-900">
            Task Manager
          </span>

          {/* User Section */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600">{user?.name}</span>

            <span className="text-neutral-300">|</span>

            <button
              id="logout-button"
              onClick={logout}
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1200px] mx-auto px-8 pt-8 pb-12">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-medium text-neutral-800">Tasks</h1>
          <button
            id="add-task-button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-[7px] border border-neutral-300 text-neutral-700 text-sm rounded-md hover:bg-neutral-100 cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add task
          </button>
        </div>

        {/* Tabs — underline style */}
        <div className="flex gap-0 border-b border-neutral-200 mb-6">
          {filters.map((f) => (
            <button
              key={f.value}
              id={`filter-${f.value || "all"}`}
              onClick={() => handleFilterChange(f.value)}
              className={`px-4 pb-[10px] text-sm border-b-2 -mb-px cursor-pointer ${
                statusFilter === f.value
                  ? "border-neutral-800 text-neutral-800 font-medium"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {showForm && <TaskForm onClose={() => setShowForm(false)} />}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-4 h-4 border-2 border-neutral-200 border-t-neutral-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <TaskList tasks={tasks} />

            <Pagination
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />

            {tasks.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-sm text-neutral-400">
                  {statusFilter
                    ? "No tasks match this filter."
                    : "No tasks yet. Create one to get started."}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

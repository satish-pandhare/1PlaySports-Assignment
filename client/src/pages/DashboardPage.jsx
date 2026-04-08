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
    fetchTasks({ status: statusFilter || undefined, page: currentPage, limit: 10 });
  }, [fetchTasks, statusFilter, currentPage]);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filters = [
    { value: "", label: "All" },
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* Simple header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-500 text-sm mb-1">Welcome back,</p>
            <h1 className="text-gray-900 text-2xl font-medium">{user?.name}</h1>
          </div>
          <button
            onClick={logout}
            className="text-gray-500 text-sm hover:text-gray-700"
          >
            Sign out
          </button>
        </div>

        {/* Add task */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="w-full text-left px-5 py-4 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-all text-base"
          >
            + Add a new task...
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === f.value
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task Form Modal */}
        {showForm && <TaskForm onClose={() => setShowForm(false)} />}

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading...</div>
        ) : (
          <>
            <TaskList tasks={tasks} />

            <Pagination
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />

            {tasks.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-gray-400 text-base">No tasks here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

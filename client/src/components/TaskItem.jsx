import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditTaskModal from "./EditTaskModal";

export default function TaskItem({ task }) {
  const { updateTask, deleteTask } = useTasks();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    setIsUpdating(true);
    try {
      await updateTask(task.id, { status: e.target.value });
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      setShowDelete(false);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "DONE";

  const isDone = task.status === "DONE";

  return (
    <>
      <div className={`group p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${isDone ? "opacity-60" : ""}`}>
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={() => updateTask(task.id, { status: isDone ? "TODO" : "DONE" })}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              isDone
                ? "bg-blue-500 border-blue-500"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            {isDone && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-gray-900 text-base mb-1 ${isDone ? "line-through text-gray-400" : ""}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-sm">
              {task.status === "IN_PROGRESS" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                  In Progress
                </span>
              )}
              {task.dueDate && (
                <span className={`flex items-center gap-1 ${isOverdue ? "text-red-600 font-medium" : "text-gray-500"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {isOverdue ? "Overdue: " : ""}{formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <select
              value={task.status}
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="text-sm bg-transparent text-gray-600 border border-gray-300 rounded-lg px-2 py-1 cursor-pointer hover:bg-gray-100 focus:outline-none focus:border-blue-400"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            <button
              onClick={() => setShowEdit(true)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showDelete && (
        <DeleteConfirmModal
          taskTitle={task.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showEdit && (
        <EditTaskModal task={task} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
}

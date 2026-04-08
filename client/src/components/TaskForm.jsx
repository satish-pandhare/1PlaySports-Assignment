import { useState } from "react";
import { useTasks } from "../context/TaskContext";

export default function TaskForm({ onClose }) {
  const { createTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createTask({ title, description: description || undefined, dueDate: dueDate || undefined });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400";

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-md p-5 shadow-sm modal-enter" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base text-neutral-800">New task</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            id="task-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title" autoFocus required
            className={`${inputCls} mb-3`}
          />
          <textarea
            id="task-description" value={description} onChange={(e) => setDescription(e.target.value)}
            rows={2} placeholder="Description (optional)"
            className={`${inputCls} mb-3 resize-none`}
          />
          <input
            id="task-due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            className={`${inputCls} mb-4`}
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}
              className="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-800 cursor-pointer"
            >Cancel</button>
            <button id="task-submit" type="submit" disabled={loading}
              className="px-4 py-2 bg-neutral-800 text-white text-sm rounded-lg hover:bg-neutral-700 disabled:opacity-50 cursor-pointer"
            >{loading ? "..." : "Add task"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

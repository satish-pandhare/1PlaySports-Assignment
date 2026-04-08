import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditTaskModal from "./EditTaskModal";

const STATUS_MAP = {
  TODO: { label: "To Do", cls: "bg-neutral-100 text-neutral-600" },
  IN_PROGRESS: { label: "In Progress", cls: "bg-amber-50 text-amber-700" },
  DONE: { label: "Done", cls: "bg-emerald-50 text-emerald-700" },
};

export default function TaskItem({ task }) {
  const { updateTask, deleteTask } = useTasks();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      setShowDelete(false);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "\u2014";
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";
  const isDone = task.status === "DONE";
  const status = STATUS_MAP[task.status] || STATUS_MAP.TODO;

  return (
    <>
      <tr className={`group hover:bg-neutral-50 ${isDone ? "opacity-50" : ""}`}>
        {/* Checkbox */}
        <td className="py-3.5 pl-4 pr-1">
          <button
            onClick={() => updateTask(task.id, { status: isDone ? "TODO" : "DONE" })}
            className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center cursor-pointer ${
              isDone ? "bg-neutral-700 border-neutral-700" : "border-neutral-300 hover:border-neutral-500"
            }`}
          >
            {isDone && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </td>

        {/* Task title + description */}
        <td className="py-3.5 px-3">
          <p className={`text-[13px] font-medium text-neutral-800 leading-snug ${isDone ? "line-through text-neutral-400 font-normal" : ""}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-[12px] text-neutral-400 mt-1 leading-normal truncate">{task.description}</p>
          )}
        </td>

        {/* Status */}
        <td className="py-3.5 px-3">
          <span className={`inline-block px-2 py-[2px] rounded text-[11px] font-medium leading-snug ${status.cls}`}>
            {status.label}
          </span>
        </td>

        {/* Due date — nowrap to prevent wrapping */}
        <td className="py-3.5 px-3 whitespace-nowrap">
          {isOverdue ? (
            <span className="text-[12px] text-red-600 font-medium">Overdue &middot; {formatDate(task.dueDate)}</span>
          ) : (
            <span className="text-[12px] text-neutral-400">{formatDate(task.dueDate)}</span>
          )}
        </td>

        {/* Actions */}
        <td className="py-3.5 pr-4">
          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100">
            <select
              value={task.status}
              onChange={(e) => updateTask(task.id, { status: e.target.value })}
              className="text-[11px] text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5 bg-white cursor-pointer hover:border-neutral-400 focus:outline-none"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            <button
              onClick={() => setShowEdit(true)}
              className="p-1 text-neutral-300 hover:text-neutral-600 cursor-pointer"
              title="Edit"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="p-1 text-neutral-300 hover:text-red-500 cursor-pointer"
              title="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {showDelete && (
        <DeleteConfirmModal taskTitle={task.title} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
      )}
      {showEdit && (
        <EditTaskModal task={task} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
}

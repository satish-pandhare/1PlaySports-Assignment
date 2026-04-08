import { useState } from "react";

export default function DeleteConfirmModal({ taskTitle, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50" onClick={onCancel}>
      <div className="bg-white rounded-lg w-full max-w-sm p-5 shadow-sm modal-enter" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base text-neutral-800 mb-1">Delete task</h3>
        <p className="text-sm text-neutral-500 mb-5">
          Delete &ldquo;{taskTitle}&rdquo;? This can&rsquo;t be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} disabled={loading}
            className="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-800 disabled:opacity-50 cursor-pointer"
          >Cancel</button>
          <button onClick={handleConfirm} disabled={loading}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 cursor-pointer"
          >{loading ? "..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );
}

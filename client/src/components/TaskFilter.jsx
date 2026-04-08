export default function TaskFilter({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-stone-500">Filter:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-stone-200 bg-white rounded-xl px-4 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400 transition-colors"
      >
        <option value="">All Tasks</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}

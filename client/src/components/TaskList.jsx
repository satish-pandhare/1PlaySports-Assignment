import TaskItem from "./TaskItem";

export default function TaskList({ tasks }) {
  if (tasks.length === 0) return null;

  return (
    <div className="bg-white border border-neutral-200 rounded-md overflow-hidden">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-12" />
          <col />
          <col className="w-32" />
          <col className="w-36" />
          <col className="w-28" />
        </colgroup>
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50/60">
            <th></th>
            <th className="text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider py-2.5 px-3">Task</th>
            <th className="text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider py-2.5 px-3">Status</th>
            <th className="text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider py-2.5 px-3">Due date</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

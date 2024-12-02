export default function TaskCard({ task, priority, onDelete, onUpdate, onDone }) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center">
        <div>
          <h3 className={`text-xl font-semibold ${task.status === 'DONE' ? 'line-through text-gray-500' : ''}`}>
            {task.task}
          </h3>
          <span
            className={`px-3 py-1 rounded-lg text-white ${
              priority === "high" ? "bg-red-500" : priority === "medium" ? "bg-yellow-500" : "bg-green-500"
            }`}
          >
            {priority} priority
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDone(task)}
            className={`px-4 py-2 rounded-lg ${task.status === 'DONE' ? 'bg-gray-500' : 'bg-green-500'} text-white`}
          >
            {task.status === 'DONE' ? "Unmark Done" : "Mark as Done"}
          </button>
          <button
            onClick={() => onUpdate(task)} 
            className={`px-4 py-2 rounded-lg text-white ${task.status === 'DONE' ? 'bg-gray-500' : 'bg-blue-500'}`}
            disabled={task.status === 'DONE'}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task)} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
  
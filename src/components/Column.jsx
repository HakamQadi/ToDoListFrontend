import { FileText } from "lucide-react"
import TaskCard from "./TaskCard"
import EmptyState from "./EmptyState"

const Column = ({ title, tasks, onViewTask, onEditTask }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 min-h-96">
      <h2 className="font-semibold text-gray-900 mb-4 text-center">{title}</h2>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <EmptyState title={`No ${title} tasks`} description={`No tasks in ${title} yet`} icon={FileText} />
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} onView={onViewTask} onEdit={onEditTask} />)
        )}
      </div>
    </div>
  )
}

export default Column

"use client"
import { Eye, Edit } from "lucide-react"
import { getStatusString } from "../utils/status"
import Button from "./Button"

const TaskCard = ({ task, onView, onEdit }) => {
  const statusString = getStatusString(task.status)

  const statusColors = {
    Todo: "bg-gray-100 text-gray-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Done: "bg-green-100 text-green-800",
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[statusString]}`}>
          {statusString}
        </span>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onView(task)} className="p-2">
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(task)} className="p-2">
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default TaskCard

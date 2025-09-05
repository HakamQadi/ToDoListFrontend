"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import Navbar from "../components/Navbar"
import SearchBar from "../components/SearchBar"
import Column from "../components/Column"
import Modal from "../components/Modal"
import Input from "../components/Input"
import Select from "../components/Select"
import Button from "../components/Button"
import Spinner from "../components/Spinner"
import ErrorAlert from "../components/ErrorAlert"
import { taskService } from "../services/taskService"
import { STATUS_OPTIONS, getStatusString } from "../utils/status"

const taskValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.number().required("Status is required"),
})

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Load tasks on component mount
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const tasksData = await taskService.getTasks()
      setTasks(tasksData)
    } catch (err) {
      setError("Failed to load tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Filter tasks based on search term
  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks
    return tasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [tasks, searchTerm])

  // Group tasks by status
  const groupedTasks = useMemo(() => {
    return {
      todo: filteredTasks.filter((task) => task.status === 0),
      pending: filteredTasks.filter((task) => task.status === 1),
      done: filteredTasks.filter((task) => task.status === 2),
    }
  }, [filteredTasks])

  const handleCreateTask = async (values, { resetForm }) => {
    try {
      setSubmitting(true)
      await taskService.createTask(values)
      await loadTasks()
      setShowCreateModal(false)
      resetForm()
    } catch (err) {
      setError("Failed to create task. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditTask = async (values) => {
    try {
      setSubmitting(true)
      await taskService.updateTask(selectedTask.id, values)
      await loadTasks()
      setShowEditModal(false)
      setSelectedTask(null)
    } catch (err) {
      setError("Failed to update task. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      setSubmitting(true)
      await taskService.deleteTask(taskId)
      await loadTasks()
      setShowEditModal(false)
      setSelectedTask(null)
    } catch (err) {
      setError("Failed to delete task. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleViewTask = (task) => {
    setSelectedTask(task)
    setShowViewModal(true)
  }

  const handleEditTaskClick = (task) => {
    setSelectedTask(task)
    setShowEditModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex-1 max-w-md">
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search tasks by title..." />
          </div>

          <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </Button>
        </div>

        {/* Error display */}
        {error && <ErrorAlert message={error} className="mb-6" />}

        {/* Kanban board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column title="Todo" tasks={groupedTasks.todo} onViewTask={handleViewTask} onEditTask={handleEditTaskClick} />
          <Column
            title="Pending"
            tasks={groupedTasks.pending}
            onViewTask={handleViewTask}
            onEditTask={handleEditTaskClick}
          />
          <Column title="Done" tasks={groupedTasks.done} onViewTask={handleViewTask} onEditTask={handleEditTaskClick} />
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Task">
        <Formik
          initialValues={{ title: "", description: "", status: 0 }}
          validationSchema={taskValidationSchema}
          onSubmit={handleCreateTask}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="space-y-4">
              <Input
                label="Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && errors.title}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.description && errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {touched.description && errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <Select
                label="Status"
                name="status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                options={STATUS_OPTIONS}
                error={touched.status && errors.status}
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={submitting} disabled={submitting}>
                  Create Task
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* View Task Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Task Details">
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <p className="text-gray-900">{selectedTask.title}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{selectedTask.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <p className="text-gray-900">{getStatusString(selectedTask.status)}</p>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Task">
        {selectedTask && (
          <Formik
            initialValues={{
              title: selectedTask.title,
              description: selectedTask.description,
              status: selectedTask.status,
            }}
            validationSchema={taskValidationSchema}
            onSubmit={handleEditTask}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="space-y-4">
                <Input
                  label="Title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title && errors.title}
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      touched.description && errors.description ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {touched.description && errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <Select
                  label="Status"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={STATUS_OPTIONS}
                  error={touched.status && errors.status}
                />

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleDeleteTask(selectedTask.id)}
                    loading={submitting}
                    disabled={submitting}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>

                  <div className="flex space-x-3">
                    <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" loading={submitting} disabled={submitting}>
                      Update Task
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Modal>
    </div>
  )
}

export default Home

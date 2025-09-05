import apiClient from "./apiClient";

export const taskService = {
  async getTasks() {
    const response = await apiClient.get("/api/tasks");
    return response.data;
  },

  async getTask(id) {
    const response = await apiClient.get(`/api/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await apiClient.post("/api/tasks/create", taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    console.log("taskData ::: ", taskData);
    const response = await apiClient.patch(`/api/tasks/update/${id}`, taskData);
    return response.data;
  },

  async deleteTask(id) {
    await apiClient.delete(`/api/tasks/delete/${id}`);
  },
};

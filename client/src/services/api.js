const API_BASE = import.meta.env.VITE_API_URL || "/api";


/**
 * Get stored auth token
 */
const getToken = () => localStorage.getItem("token");

/**
 * Make API request with auth header
 */
const request = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.errors?.join(", ") || "Request failed");
  }

  return data;
};

// Auth API
export const authApi = {
  register: (userData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getProfile: () => request("/auth/profile"),
};

// Tasks API
export const tasksApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append("status", params.status);
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    const queryString = query.toString();
    return request(`/tasks${queryString ? `?${queryString}` : ""}`);
  },

  getOne: (id) => request(`/tasks/${id}`),

  create: (taskData) =>
    request("/tasks", { method: "POST", body: JSON.stringify(taskData) }),

  update: (id, taskData) =>
    request(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(taskData),
    }),

  delete: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};

import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("leetcoach_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear auth state
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("leetcoach_token");
      localStorage.removeItem("leetcoach_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth API ──
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
};

// ── Challenge API ──
export const challengeAPI = {
  generateChallenge: () => API.post("/challenges/generate"),
  getTodayChallenge: () => API.get("/challenges/today"),
  markComplete: (problemId) => API.put(`/challenges/complete/${problemId}`),
};

// ── AI API ──
export const aiAPI = {
  getHints: (data) => API.post("/ai/hints", data),
  explainSolution: (data) => API.post("/ai/explain", data),
  chat: (data) => API.post("/ai/chat", data),
  reviewCode: (data) => API.post("/ai/review", data),
  // RAG endpoints
  askKnowledgeBase: (data) => API.post("/ai/ask", data),
  getRAGStatus: () => API.get("/ai/rag-status"),
};

export default API;

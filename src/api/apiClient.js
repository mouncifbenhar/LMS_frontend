import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3500",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null,
  onUnauthorized = null,
  onForbidden = null
) {
  const headers = {};

  if (token) {
    headers.Authorization = "Bearer " + token;
  }

  const config = {
    url: endpoint,
    method: method,
    headers: headers,
  };

  if (body) {
    config.data = body;
  }

  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      if (onUnauthorized) {
        onUnauthorized();
      }
      throw new Error("Session expired. Please login again.", { cause: error });
    }

    if (status === 403) {
      if (onForbidden) {
        onForbidden("Access denied: You do not have permission.");
      }
      throw new Error("Access denied: You do not have permission.", {
        cause: error,
      });
    }

    throw new Error(message || "Something went wrong. Please try again.", {
      cause: error,
    });
  }
}
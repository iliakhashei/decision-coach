import { getUserId } from "./auth";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const userId = getUserId();
  const method = (options.method || "GET").toUpperCase();

  let url = `${API_BASE_URL}${path}`;

  // Add user_id as query param for every authenticated request
  if (userId) {
    const separator = url.includes("?") ? "&" : "?";
    url = `${url}${separator}user_id=${userId}`;
  }

  let body = options.body;

  // Also keep user_id in POST body for endpoints like recommendation
  if (userId && body && typeof body === "string" && method !== "GET") {
    try {
      const parsed = JSON.parse(body);
      body = JSON.stringify({ ...parsed, user_id: userId });
    } catch {
      body = options.body;
    }
  }

  const response = await fetch(url, {
    ...options,
    body,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const errorData = await response.json();
      if (typeof errorData.detail === "string") {
        message = errorData.detail;
      } else {
        message = JSON.stringify(errorData.detail ?? errorData);
      }
    } catch {
      message = await response.text();
    }
    throw new Error(message);
  }

  return response.json();
}
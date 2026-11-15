import { apiRequest } from "../api/apiClient";

export async function getAllCourses(token, onLogout, onForbidden) {
  const response = await apiRequest(
    "/courses",
    "GET",
    null,
    token,
    onLogout,
    onForbidden
  );
  return response.data?.courses || [];
}

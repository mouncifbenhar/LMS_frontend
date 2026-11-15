const API_URL = "http://localhost:3500";

export async function apiRequest(endpoint, method = "GET", body = null, token = null, onUnauthorized = null, onForbidden = null) {
  
 
  const headers = {
    "Content-Type": "application/json",
  };


  if (token) {
    headers.Authorization = "Bearer " + token;
  }


  const config = {
    method: method,
    headers: headers,
  };


  if (body) {
    config.body = JSON.stringify(body);
  }


  const response = await fetch(API_URL + endpoint, config);
  const data = await response.json();


  if (response.ok) {
    return data;
  }

 
  if (response.status === 401) {
    if (onUnauthorized) {
      onUnauthorized();
    }
    throw new Error("Session expired. Please login again.");
  }

  if (response.status === 403) {
    if (onForbidden) {
      onForbidden("Access denied: You do not have permission.");
    }
    throw new Error("Access denied: You do not have permission.");
  }
  throw new Error(data.message || "Something went wrong. Please try again.");
}
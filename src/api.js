

const API_BASE_URL = 'https://c24d-49-245-111-44.ngrok-free.app/api';




/**
 * Fetches data from a given API endpoint.
 * @param {string} endpoint - The API endpoint (e.g., 'Farms/GetAllFarms').
 * @param {string} [method='GET'] - HTTP method (GET, POST, PUT, DELETE).
 * @param {object} [body=null] - Request body for POST/PUT.
 * @param {string} [token=null] - Authentication token.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of data.
 * @throws {Error} - Throws an error if the fetch fails or response is not OK.
 */
export const fetchDataFromApi = async (endpoint, method = 'GET', body = null, token = null) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    signal: controller.signal // Add abort controller
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
    clearTimeout(timeoutId); // Clear timeout if request succeeds

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.detail || errorMessage;
      } catch {
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (Object.keys(data).length === 0 ? [] : [data]);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out after 5 seconds');
    }
    throw error;
  }
};

// --- AUTHENTICATION API SIMULATION ---
// In a real app, these would be calls to your .NET Core API's Login/Register endpoints
export const loginUser = async (email, password) => {
  console.log("Simulating Login API call...");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  if (email === "test@example.com" && password === "password") { // Mock success
    return { email, id: "mockUser123", token: "mock_jwt_token" };
  } else if (email === "new@example.com" && password === "newpassword") {
    throw new Error("User 'new@example.com' does not exist. Please register.");
  } else {
    throw new Error("Invalid credentials.");
  }
};

export const registerUser = async (email, password) => {
  console.log("Simulating Register API call...");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  if (email === "test@example.com") { // Mock failure if already registered
    throw new Error("User 'test@example.com' already exists.");
  } else { // Mock success
    return { email, id: "mockNewUser456", token: "mock_new_jwt_token" };
  }
};

export const logoutUser = async (token) => {
    console.log("Simulating Logout API call with token:", token);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    // In real API, invalidate token/session
    return true;
};

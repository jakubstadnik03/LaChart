import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Setup interceptors for response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Throw an error specifically for unauthorized access
      throw new Error("Unauthorized");
    }
    return Promise.reject(error);
  }
);

let authToken = localStorage.getItem("authToken") || "";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/user/login", { email, password });
    authToken = response.data.token;
    localStorage.setItem("authToken", authToken);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await api.post(
      "/user/logout",
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    localStorage.removeItem("authToken");
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};

export const registerUser = async (data) => {
  const { userName, email, password, confirmPassword } = data;
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }
  try {
    const response = await api.post("/user/register", {
      userName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAthletesByUser = async () => {
  try {
    const response = await api.get("/athletes/listByUser/", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchMeasurementsByAthlete = async (athleteId) => {
  try {
    const response = await api.get(`/measurements/${athleteId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveNewTesting = async (testingData) => {
  try {
    const response = await api.post("/measurements", testingData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const editTesting = async (testingId, testingData) => {
  try {
    const response = await api.put(`/measurements/${testingId}`, testingData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assuming you are using token-based auth
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update testing", error);
    throw error;
  }
};

export const addNewAthlete = async (athleteData) => {
  try {
    const response = await api.post("/athletes", athleteData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editAthlete = async (athleteId, athleteData) => {
  try {
    const response = await api.put(`/athletes/${athleteId}`, athleteData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Assuming the endpoint to delete a testing is /testing/:id
export const deleteTesting = async (testingId) => {
  try {
    const response = await api.delete(`/measurements/${testingId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data; // or just return to handle response elsewhere
  } catch (error) {
    throw error;
  }
};

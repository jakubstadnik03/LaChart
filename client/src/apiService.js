import axios from "axios";
import { Navigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let authToken = localStorage.getItem("authToken") || "";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/user/login", { email, password });
    authToken = response.data.token;
    console.log(response);
    localStorage.setItem("authToken", authToken);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logoutUser = async (navigate) => {
  try {
    await api.post(
      "/user/logout",
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log("SUCCESS LOGOUT");
    navigate("/login");
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

  // More validations can be added here

  try {
    const response = await api.post('/user/register', {
      userName,
      email,
      confirmPassword,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const listSessions = async () => {
  try {
    const authToken = localStorage.getItem("authToken") || "";
    const response = await api.get("/translationSession/", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchAthletesByUser = async () => {
    try {
        const authToken = localStorage.getItem("authToken") || "";

        const response = await api.get(`/athletes/listByUser/`, {
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
export const saveNewTesting = async ( testingData) => {
    try {
      const response = await api.post(`/measurements`, testingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Assuming you are using token-based auth
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to save new testing', error);
      throw error;
    }
  };
  export const addNewAthlete = async (athleteData) => {
    try {
      const response = await api.post('/athletes', athleteData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add new athlete', error);
      throw error;
    }
  };

  // Function to edit an existing athlete
  export const editAthlete = async (athleteId, athleteData) => {
    try {
      const response = await api.put(`/athletes/${athleteId}`, athleteData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update athlete', error);
      throw error;
    }
  };
  
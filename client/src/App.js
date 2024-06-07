import { BrowserRouter as Router, Routes, Route,   Navigate,
} from 'react-router-dom';
import './App.css';
import React, { useState, useEffect } from "react";

import MainPage from './pages/MainPage';
import Login from './pages/Login';
import { AuthProvider } from './AuthContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // Effect to update local storage whenever isLoggedIn changes
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);
  return (
    <AuthProvider>
        <div className="App">
          <Routes>
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
                      {isLoggedIn ? (
            <>
              <Route path="/" element={<MainPage />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
          </Routes>
        </div>
    </AuthProvider>
  );
}

export default App;

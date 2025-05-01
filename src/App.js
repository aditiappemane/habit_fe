import React, { useState,useEffect } from "react";
import axios from "axios";
import TodoPage from "./projects/todos"; 
import "./App.css";
import HabitsToday from "./projects/track";

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(null); 
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [refreshHabits, setRefreshHabits] = useState(false);

  const handleTodoAdded = () => {
    // Toggle state to trigger re-render or useEffect in HabitsToday
    console.log("changing")
    setRefreshHabits(prev => !prev);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUser(storedUserId);
      setUserId(storedUserId);
    }
  }, []);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res=await axios.post("https://habit-be.onrender.com/api/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      
      // setSuccessMessage(res.data.message || "Login successful");
      setUser(res.data.userId); 
      setUserId(res.data.userId);
      localStorage.setItem("userId", res.data.userId);

    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }
    try {
      const res = await axios.post(
        "https://habit-be.onrender.com/api/signup",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage(res.data.message || "Signup successful");
      setShowLogin(true); 
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Signup failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUser(null); 
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000); 
  
      return () => clearTimeout(timer); 
    }
  }, [errorMessage, successMessage]);

  if (user) {
    return (
      <div className="app-wrapper">
        <button type="button" onClick={handleLogout} className="logout-button">
          Logout
        </button>
  
        <div className="dashboard-container">
      <div className="todo-section">
        <TodoPage userId={user} onTodoAdded={handleTodoAdded} />
      </div>
      <div className="today-section">
        <HabitsToday userId={user} refreshTrigger={refreshHabits} />
      </div>
    </div>
      </div>
    );
  }
  

 
  
  return (
    <div className="container">
  <div className="form-box">
    <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
      {showLogin ? "Login to Your Account" : "Create a New Account"}
    </h2>
    <form onSubmit={showLogin ? handleLogin : handleSignup}>
    {errorMessage && <div className="message-box error">{errorMessage}</div>}
{successMessage && <div className="message-box success">{successMessage}</div>}

      <input
        type="email"
        placeholder="Email Address"
        required
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {!showLogin && (
        <>
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="back-button"
          >
            Back
          </button>
          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </>
      )}
      <button type="submit" className="button">
        {showLogin ? "Login" : "Register"}
      </button>
      <div className="toggle">
        {showLogin ? (
          <>
            Don't have an account?{" "}
            <span
              onClick={() => {
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setShowLogin(false);
              }}
              className="link"
            >
              Sign Up
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              onClick={() => {
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setShowLogin(true);
              }}
              className="link"
            >
              Login
            </span>
          </>
        )}
      </div>
    </form>
  </div>
</div>

  );
}

export default App;

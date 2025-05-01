import axios from "axios";
import { useState, useEffect } from "react";
import "./todos.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TodoPage({ userId ,onTodoAdded }) {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [targetDays, setTargetDays] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [customDays, setCustomDays] = useState([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const allDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
useEffect(() => {
  console.log("from custom", customDays);
}, [customDays]);

const fetchTodos = async () => {
  try {
    const res = await axios.get(
      `https://habit-be.onrender.com/api/todos?userId=${userId}`
    );
    setTodos(res.data);
  } catch (err) {
    alert("Failed to load todos");
  }
};
  useEffect(() => {
     fetchTodos();
  }, [userId]);

  const addTodo = async () => {
    if (!task.trim()) return;
    console.log("customDays",customDays)
    try {
      const res = await axios.post("https://habit-be.onrender.com/todos", {
        task,
        userId,
        selectedDates,
        targetDays: customDays,
        startDate,
      });
      console.log("from fetch", res.data);
      
      setTodos([...todos, res.data]);
      console.log("called the function")
      onTodoAdded()
      setTask("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleCompleted = async (id, currentStatus) => {
    try {
      const res = await axios.patch(`https://habit-be.onrender.com/todos/${id}`, {
        completed: !currentStatus,
      });
      console.log("from toggle", res);
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const editTodo = async (id) => {
    try {
      const res = await axios.patch(`https://habit-be.onrender.com/todos/${id}`, {
        task: editTask,
      });
      console.log("from edit", res);
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
      setEditId(null);
      setEditTask("");
    } catch (err) {
      console.error("Error editing todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://habit-be.onrender.com/todos/${id}`);

      setTodos(todos.filter((todo) => todo._id !== id));
      onTodoAdded()
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-header">
        🗒️ HabitVault – Daily Habit Tracker with Visual Streaks
      </h1>

      <div className="todo-input-container">
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="todo-input"
        />
        <div className="todo-select-wrapper">
          <select
            value={targetDays}
            onChange={(e) => {
              const value = e.target.value;
              console.log("1", value);
              if (value == "Every Day") {
                setCustomDays([...allDays]);
                setShowCustomPopup(false);
              } else if (value == "Weekdays") {
                setCustomDays([
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ]);
                setShowCustomPopup(false);
              } else if (value == "Custom") {
                setCustomDays([]); // reset on new custom
                setShowCustomPopup(true);
              }
            }}
            className="todo-select"
          >
            <option value="Every Day">Every Day</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Custom">Custom</option>
          </select>

          {/* ✅ Custom Popup outside the select */}
          {showCustomPopup && (
            <div className="custom-popup">
              <h4>Select Custom Days</h4>
              <div className="custom-days">
                {allDays.map((day) => (
                  <label key={day}>
                    <input
                      type="checkbox"
                      checked={customDays.includes(day)}
                      onChange={() =>
                        setCustomDays((prev) =>
                          prev.includes(day)
                            ? prev.filter((d) => d !== day)
                            : [...prev, day]
                        )
                      }
                    />
                    {day}
                  </label>
                ))}
              </div>
              <button
                className="todo-popup-done-button"
                onClick={() => setShowCustomPopup(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="todo-date-input"
        />
        <button onClick={addTodo} className="todo-add-button">
          Add
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            {editId === todo._id ? (
              <input
                value={editTask}
                onChange={(e) => setEditTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") editTodo(todo._id);
                }}
                className="todo-edit-input"
              />
            ) : (
              <span
                onClick={() => {
                  if (editId !== todo._id)
                    toggleCompleted(todo._id, todo.completed);
                }}
                className={`todo-task ${todo.completed ? "completed" : ""}`}
              >
                {todo.task}
              </span>
            )}
            <div className="todo-details">
              🎯 Target Days:{" "}
              {todo.targetDays
                ? todo.targetDays.map((day) => (
                    <span key={day} className="todo-day-chip">
                      {day}
                    </span>
                  ))
                : "Not Set"}
            </div>
           
            <div className="todo-details">
            Start Date 📅 {todo.startDate ? todo.startDate.slice(0, 10) : "Not Set"}
            </div>
           
            <button
              onClick={() => deleteTodo(todo._id)}
              className="todo-delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoPage;

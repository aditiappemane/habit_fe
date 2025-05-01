import axios from "axios";
import { useState, useEffect } from "react";
import "./todos.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function TodoPage({ userId }) {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [targetDays, setTargetDays] = useState("Every Day");
  const [startDate, setStartDate] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);


  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/todos?userId=${userId}`
        );
        setTodos(res.data);
      } catch (err) {
        alert("Failed to load todos");
      }
    };

    fetchTodos();
  }, [userId]);

  const addTodo = async () => {
    if (!task.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/todos", {
        task,
        userId,
        selectedDates,
      });
      console.log("from fetch",res.data)
      setTodos([...todos, res.data]);
      setTask("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleCompleted = async (id, currentStatus) => {
    try {
      const res = await axios.patch(`http://localhost:5000/todos/${id}`, {
        completed: !currentStatus,
      });
      console.log("from toggle",res)
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const editTodo = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/todos/${id}`, {
        task: editTask,
      });
      console.log("from edit",res)
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
      setEditId(null);
      setEditTask("");
    } catch (err) {
      console.error("Error editing todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
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
        <select
          value={targetDays}
          onChange={(e) => setTargetDays(e.target.value)}
          className="todo-select"
        >
          <option value="Every Day">Every Day</option>
          <option value="Weekdays">Weekdays</option>
          <option value="Custom">Custom</option>
        </select>
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
            <div className="todo-details">Target days🎯 {todo.targetDays}</div>
            <div className="todo-details">
              Start Date 📅 {todo.startDate || "Not Set"}
            </div>
            {editId === todo._id ? (
              <button
                onClick={() => editTodo(todo._id)}
                className="todo-save-button"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditId(todo._id);
                  setEditTask(todo.task);
                }}
                className="todo-edit-button"
              >
                Edit
              </button>
            )}

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

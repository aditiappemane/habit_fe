import React, { useEffect, useState } from "react";
import axios from "axios";

  const TodayHabits = ({ userId ,refreshTrigger}) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMap, setStatusMap] = useState({});
  const [streaks, setStreaks] = useState({});

  const fetchTodayHabitsAndStatuses = async () => {
    try {
      const res = await axios.get("https://habit-be.onrender.com/api/habits/today", {
        params: { userId },
      });
      setHabits(res.data);

      const statusRes = await axios.get("https://habit-be.onrender.com/api/habits/statuses", {
        params: { userId },
      });

      const streakRes = await axios.get("https://habit-be.onrender.com/api/habits/streaks", {
        params: { userId },
      });
      setStreaks(streakRes.data);

      const map = {};
      statusRes.data.forEach((entry) => {
        map[entry.habitId.toString()] = entry.status;
      });

      setStatusMap(map);
    } catch (err) {
      console.error(err);
      setError("Failed to load today's habits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (userId) {
      fetchTodayHabitsAndStatuses();
    }
  }, [userId,refreshTrigger]);


  const toggleStatus = async (habitId, status) => {
    try {
      await axios.post("https://habit-be.onrender.com/api/habits/checkin", {
        habitId,
        userId,
        status,
      });
      fetchTodayHabitsAndStatuses();
      setStatusMap((prev) => ({ ...prev, [habitId]: status }));

    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p className="text-gray-600">Loading habits...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Today's Habits</h2>

      {habits.length === 0 ? (
        <p className="text-gray-500">No habits scheduled for today.</p>
      ) : (
        <ul className="space-y-4">
          {habits.map((habit) => {
            const status = statusMap[habit._id];
            const bgColor =
              status === "completed"
                ? "bg-green-100"
                : status === "missed"
                ? "bg-red-100"
                : "bg-gray-50";

            return (
              <li
                key={habit._id}
                className={`flex justify-between items-center p-4 rounded-lg shadow ${bgColor}`}
              >
                <div>
                  <p className="font-medium text-gray-800">{habit.task}</p>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>🔥 Current: {streaks[habit._id]?.currentStreak || 0}</p>
                    <p>🏆 Longest: {streaks[habit._id]?.longestStreak || 0}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleStatus(habit._id, "completed")}
                    className={`px-3 py-1 rounded-full font-medium text-sm transition ${
                      status === "completed"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-green-100"
                    }`}
                  >
                    ✅
                  </button>
                  <button
                    onClick={() => toggleStatus(habit._id, "missed")}
                    className={`px-3 py-1 rounded-full font-medium text-sm transition ${
                      status === "missed"
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-red-100"
                    }`}
                  >
                    ❌
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TodayHabits;

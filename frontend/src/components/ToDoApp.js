// src/components/ToDoApp.js
import { useState, useEffect } from "react";
import axios from "axios";
import "./ToDoApp.css";

function ToDoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/tasks").then((res) => {
      setTasks(res.data);
    });
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    axios
      .post("http://localhost:3001/tasks", { content: newTask })
      .then((res) => {
        setTasks([res.data, ...tasks]);
        setNewTask("");
      });
  };

  const removeTask = (id) => {
    axios.delete(`http://localhost:3001/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  return (
    <div className="wrapper">
      <header>Todo App</header>
      <div className="inputField">
        <input
          type="text"
          value={newTask}
          placeholder="Add your new todo"
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask} className={newTask.trim() ? "active" : ""}>
          +
        </button>
      </div>
      <ul className="todoList">
        {tasks.map((task) => (
          <li key={task.id}>
            {task.content}{" "}
            <button onClick={() => removeTask(task.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoApp;
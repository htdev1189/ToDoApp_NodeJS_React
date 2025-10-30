>xây dựng dự án Todo List kết nối MySQL theo từng bước rõ ràng, gồm cả backend (Node.js + Express) và frontend (React).
---

## 🧱 Bước 1: Tạo cấu trúc thư mục dự án
```bash
mkdir todo-app
cd todo-app
mkdir backend frontend
```
## ⚙️ Bước 2: Thiết lập Backend với Node.js + Express + MySQL
### 2.1. Khởi tạo backend
```bash
cd backend
npm init -y
npm install express mysql2 cors
```
### 2.2. Tạo file server.js
```css
File server.js này là máy chủ backend (API server), nó có nhiệm vụ: 
  - Kết nối với MySQL database.
  - Cung cấp các endpoint API cho ứng dụng frontend (React).
  - Cho phép thêm, lấy danh sách, và xóa các công việc (task).
```
```js
// backend/server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Lấy danh sách task
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Thêm task
app.post("/tasks", (req, res) => {
  const { content } = req.body;
  db.query("INSERT INTO tasks (content) VALUES (?)", [content], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, content });
  });
});

// Xóa task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
```
---
### 2.3. Tạo database MySQL
Vào MySQL và chạy:
```sql
CREATE DATABASE react_todo_app;

USE react_todo_app;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
---
## 🎨 Bước 3: Thiết lập Frontend với React
3.1. Khởi tạo frontend
```bash
cd ../frontend
npx create-react-app .
npm install axios
```
---
### 3.2. Cấu trúc thư mục frontend
```css
frontend/
├── src/
│   ├── components/
│   │   └── ToDoApp.js
│   │   └── ToDoApp.css
│   ├── App.js
│   ├── index.js
```
---
### 3.3. Viết component ToDoApp.js
```js
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
```
---
### 3.4. Sửa App.js
```js
// src/App.js
import ToDoApp from "./components/ToDoApp";

function App() {
  return <ToDoApp />;
}

export default App;
```
---
### 3.5. Thêm CSS vào style.css
Bạn có thể dùng lại file CSS bạn đã gửi trước đó vào public

---
## 🚀 Bước 4: Chạy ứng dụng
### 4.1. Chạy backend
```bash
cd backend
node server.js
```
### 4.2. Chạy frontend
```bash
cd ../frontend
npm start
```
## ✅ Kết quả
Truy cập http://localhost:3000 để xem ứng dụng React

Backend chạy ở http://localhost:3001

Dữ liệu được lưu vào MySQL

## 🚀 Cách cài đặt và chạy dự án
### 1. Clone dự án về máy
```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```
---
### 2. Cài đặt và chạy Backend
```bash
cd backend
npm install
```
---
#### ⚙️ Cấu hình MySQL
Tạo database và bảng:
```sql
CREATE DATABASE todo_app;

USE todo_app;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
---
Cập nhật thông tin kết nối, thay đổi các thông số cần thiết
```bash
cd backend
cp .env.example .env
```

---
Chạy server:
```bash
node server.js
```
Server sẽ chạy tại: http://localhost:3001

---
### 3. Cài đặt và chạy Frontend
```bash
cd ../frontend
npm install
npm start
```
---
Ứng dụng sẽ chạy tại: http://localhost:3000
### 📌 Ghi chú
- Đảm bảo MySQL đang chạy trên máy bạn.

- Nếu dùng XAMPP, hãy kiểm tra cổng và user/password.
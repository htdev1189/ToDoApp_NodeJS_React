require("dotenv").config(); // load biến từ .env

// backend/server.js
const express = require("express"); // framework của NodeJs, giúp tạo web server và API 
const mysql = require("mysql2"); // thư viện kết nối MYSQL
const cors = require("cors"); //  Cho phép frontend (React) có thể gọi API từ các domain khác (Cross-origin)

const app = express(); // Khởi tạo ứng dựng express
app.use(cors()); // Kích hoạt CORS để cho phép request từ React frontend 
app.use(express.json()); // Cho phép server hiểu dữ liệu JSON từ body của request

// Kết nối MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

/**
 * Lấy danh sách task
 * 
 * Client (React) gọi GET http://localhost:3001/tasks
 * Server lấy dữ liệu trong bảng tasks, sắp xếp theo id giảm dần.
 * Trả về JSON dạng 
 * [
    { "id": 3, "content": "Học React" },
    { "id": 2, "content": "Đi chợ" },
    { "id": 1, "content": "Rửa bát" }
  ]
 */
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json(err); // nếu có lỗi trả về mã 500
    res.json(results); // gửi danh sách về cho client (frontend -- React)
  });
});




/**
 * Thêm task
 * 
 * Khi frontend gửi request:
 *    POST /tasks
 *    Content-Type: application/json
 *    {
 *      "content": "Học Node.js"
 *    }
 * 
 * Server chèn bản ghi mới vào bảng tasks
 * 
 * Trả về kết quả:
 * { 
 *    "id": 4,
 *    "content": "Học Node.js"
 *  }
 */
app.post("/tasks", (req, res) => {
  const { content } = req.body; // Lấy dữ liệu được gửi từ frontend (React)
  db.query("INSERT INTO tasks (content) VALUES (?)", [content], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, content }); // Trả về id mới được insert cùng nội dung
  });
});

/**
 * Xóa task
 * 
 * Khi frontend gọi:
 *    DELETE /tasks/3
 * → Server sẽ xóa task có id = 3 trong bảng tasks.
 * 
 * Trả về:
 * {
 *    { "success": true }
 * }
 */
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

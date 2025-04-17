require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:5173', 'https://hmcts-project.vercel.app/'], //vercel frontend],
    credentials: true
}));

// app.options('*', cors());

console.log('Connecting to MySQL database at:', process.env.MYSQLHOST);

// MySQL connection pool
const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(bodyParser.json());

// Test DB connection
pool.getConnection()
    .then(conn => {
        console.log('Connected to MySQL database');
        conn.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

// POST /tasks
app.post('/tasks', async (req, res) => {
    const { task, description = null, due_date } = req.body;
    
    if (!task || !due_date) {
        return res.status(400).json({ error: "Both 'task' and 'due_date' are required" });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO tasks (task, description, completed, due_date) VALUES (?, ?, FALSE, ?)',
            [task, description, due_date]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /tasks
app.get('/tasks', async (req, res) => {
    try {
        let query = 'SELECT * FROM tasks';
        const params = [];
        
        if (req.query.showCompleted === 'true') {
            query += ' WHERE completed = TRUE';
        } else if (req.query.showCompleted === 'false') {
            query += ' WHERE completed = FALSE';
        }
        
        query += ' ORDER BY due_date ASC';
        
        const [rows] = await pool.query(query, params);
        res.json({ status: 200, tasks: rows, success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /tasks/:id
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: "'completed' must be a boolean" });
    }

    try {
        const [result] = await pool.query(
            'UPDATE tasks SET completed = ? WHERE id = ?',
            [completed, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        res.json({ status: 200, message: "Task updated successfully", success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const [result] = await pool.query(
            'DELETE FROM tasks WHERE id = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        res.json({ status: 200, message: "Task deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT;


if (!port) {
    console.error('PORT environment variable is not set');
    process.exit(1);
}

console.log('PORT:', port);


app.use(bodyParser.json());


const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:5173',
        'https://hmcts-project.vercel.app',
        'https://hmcts-project-djnn9wysd-xzaryus-projects.vercel.app'], //vercel frontend],
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
    
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
    
// Test DB connection
pool.getConnection()
    .then(conn => {
        console.log('Connected to MySQL database');
        conn.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

    // JWT middleware
    const authenticateJWT = (req, res, next) => {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({ error: "No token provided" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: "Invalid token" });
            }

            req.user = user; //store user information from TWT
            next();
        });
    };

// User registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Both 'username' and 'password' are required" });
    }

// password validation

    const validLength = password.length >= 8;
    const specialChar = (password.match(/[^a-zA-Z]/g) || []).length

    if (!validLength || specialChar < 3) {
        return res.status(400).json({ error: "Password must be at least 8 characters long and contain at least 3 special characters" });
    }

    try {

        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "User already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Both 'username' and 'password' are required" });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }
        
        const user = rows[0];
        const ValidPassword = await bcrypt.compare(password, user.password);
        
        if (!ValidPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }
        
        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /tasks
app.post('/tasks',authenticateJWT, async (req, res) => {
    const { task, description = null, due_date } = req.body;
    const { user_id } = req.user;
    
    if (!task || !due_date) {
        return res.status(400).json({ error: "Both 'task' and 'due_date' are required" });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO tasks (task, description, completed, due_date, user_id) VALUES (?, ?, FALSE, ?)',
            [task, description, due_date, user_id]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /tasks
app.get('/tasks', authenticateJWT, async (req, res) => {
    const { user_id } = req.user;

    try {
        let query = 'SELECT * FROM tasks WHERE user_id = ?'
        const params = [user_id];
        
        if (req.query.showCompleted === 'true') {
            query += ' AND completed = TRUE';
        } else if (req.query.showCompleted === 'false') {
            query += ' AND completed = FALSE';
        }
        
        query += ' ORDER BY due_date ASC';
        
        const [rows] = await pool.query(query, params);
        res.json({ status: 200, tasks: rows, success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /tasks/:id
app.put('/tasks/:id', authenticateJWT, async (req, res) => {
    const { user_id } = req.user;
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: "'completed' must be a boolean" });
    }

    try {
        const [result] = await pool.query(
            'UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?',
            [completed, id, user_id]
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
app.delete('/tasks/:id', authenticateJWT, async (req, res) => {
    const { user_id } = req.user;
    const { id } = req.params;
    
    try {
        const [result] = await pool.query(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [id, user_id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        res.json({ status: 200, message: "Task deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


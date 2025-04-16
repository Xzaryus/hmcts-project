const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173',

    credentials: true
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tasks.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the tasks database.');
})

app.use(bodyParser.json()); // support json encoded bodies


// POST request
app.post('/tasks', (req, res) => {
    const { task, description = null, due_date } = req.body;
    const completed = false;

    if (!task || !due_date) {
        return res.status(400).json({ error: "Both 'task' and 'due_date' are required"}); // Bad Request
    }

    const sql = `INSERT INTO tasks (task,description, completed, due_date) 
    VALUES (?, ?, ?, ?)`;

    db.run(sql, [task, description, completed, due_date], function (err) {
        if (err) return res.json({ error: err.message }); // Internal Server Error

        res.status(201).json({ id: this.lastID }); // Return ID of inserted task
    });
});

// GET request
app.get('/tasks', (req, res) => {
    let sql = `SELECT * FROM tasks`;
    let params = [];

    const showCompleted = req.query.showCompleted;
    if (showCompleted === 'true') {
        sql += ' WHERE completed = 1';
    } else if (showCompleted === 'false') {
        sql += ' WHERE completed = 0';
    }

    sql += ' ORDER BY due_date ASC';

    db.all(sql, params, (err, rows) => {
        if (err) return res.json({ error: err.message }); // Internal Server Error
        if (rows.length === 0) return res.json({ error: "No tasks found" });
        res.json({status: 200, tasks: rows, success: true});
    });
});

// PUT request
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: "'completed' must be a boolean" });
    } 
// Convert completed value to 0 or 1 as SQLite doesn't support boolean
    const completedValue = completed ? 1 : 0;

    const sql = `UPDATE tasks SET completed = ? WHERE id = ?`;
    db.run(sql, [completedValue, id],
        function (err) {
            if (err) return res.status(500).json({ 'Database error': err.message }); // Internal Server Error

            if (this.changes === 0) {
                return res.status(404).json({ error: "Task not found" }); // Not Found
            }

            res.json({ status: 200, message: "Task updated successfully", success: true });
        });
});


// DELETE request
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM tasks WHERE id = ?`;
    db.run(sql, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message }); // Internal Server Error

        if (this.changes === 0) {
            return res.status(404).json({ error: "Task not found" }); // Not Found
        }

        res.json({ status: 200, message: "Task deleted successfully", success: true });
    });
});
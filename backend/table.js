const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tasks.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the tasks database.');
})

const sql = `CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    due_date DATETIME
)`;

db.run(sql, (err) => {
    if (err) return console.error(err.message);
    console.log('Table created.');
})

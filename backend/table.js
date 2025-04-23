require('dotenv').config();
const mysql = require('mysql2/promise');

async function createTable() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
        port: process.env.MYSQLPORT
    });

    console.log('Connected to MySQL database');

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQLDATABASE}`);
    console.log('Database created successfully or already exists');
    
    await connection.query(`USE ${process.env.MYSQLDATABASE}`);
    console.log('Using the correct database');

    const sqlUsers = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL
    )`;

    await connection.query(sqlUsers);
    
    const sql = `CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        due_date DATETIME NOT NULL
    )`;
    
    await connection.query(sql);
    console.log('Table created successfully');

    //Update Tasks

    const taskUpdate = `ALTER TABLE tasks
ADD COLUMN user_id INT,
ADD CONSTRAINT fk_user_task FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
`;

    await connection.query(taskUpdate);
    console.log('Table updated successfully');

    // clear tasks
    const clearTasks = `TRUNCATE TABLE tasks`;
    await connection.query(clearTasks);
    await connection.end();
}

createTable().catch(err => {
    console.error('Error:', err);
});
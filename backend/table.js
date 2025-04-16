require('dotenv').config();
const mysql = require('mysql2/promise');

async function createTable() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    const sql = `CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        due_date DATETIME NOT NULL
    )`;
    
    await connection.query(sql);
    console.log('Table created successfully');
    await connection.end();
}

createTable().catch(err => {
    console.error('Error:', err);
});
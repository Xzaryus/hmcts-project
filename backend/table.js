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
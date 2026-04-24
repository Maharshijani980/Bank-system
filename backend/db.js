require("dotenv").config();
const mysql = require("mysql2");

const dbConfig = {
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "Maharshi@123",
    database: process.env.MYSQL_DATABASE || "BankSystem"
};

const db = mysql.createConnection({
    ...dbConfig
});

db.connect((err) => {
    if (err) {
        console.log("Database Error:", err.message);
        console.log(`Connection config -> host: ${dbConfig.host}, port: ${dbConfig.port}, user: ${dbConfig.user}, database: ${dbConfig.database}, passwordSet: ${Boolean(dbConfig.password)}`);
        console.log("Server will continue without database connection. Some features may not work.");
    } else {
        console.log("MySQL Connected...");
    }
});

// Handle connection errors
db.on('error', (err) => {
    console.log('Database connection error:', err.message);
});

module.exports = db;

require("dotenv").config();
const mysql = require("mysql2");

const dbConfig = {
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "Maharshi@123",
    database: process.env.MYSQL_DATABASE || "BankSystem",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableAutoCommit: true
};

// Use createPool instead of createConnection for better handling
const db = mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
});

db.connect((err) => {
    if (err) {
        console.log("Database Error:", err.message);
        console.log(`Connection config -> host: ${dbConfig.host}, port: ${dbConfig.port}, user: ${dbConfig.user}, database: ${dbConfig.database}, passwordSet: ${Boolean(dbConfig.password)}`);
        console.log("Server will continue without database connection. Some features may not work.");
    } else {
        console.log("MySQL Connected...");
        // Ensure autocommit is enabled
        db.query("SET AUTOCOMMIT = 1", (err) => {
            if (err) {
                console.error("Error setting AUTOCOMMIT:", err);
            } else {
                console.log("AUTOCOMMIT enabled");
            }
        });
    }
});

// Handle connection errors
db.on('error', (err) => {
    console.log('Database connection error:', err.message);
});

module.exports = db;

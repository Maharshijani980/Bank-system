require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'Maharshi@123',
    database: 'BankSystem'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
    }
    console.log('✅ Connected to database');

    // Check customer count
    db.query('SELECT COUNT(*) as total FROM Customer', (err, result) => {
        if (err) {
            console.error('❌ Error querying customers:', err.message);
            db.end();
            return;
        }
        console.log('\n📊 Total Customers in Database:', result[0].total);

        // Get all customers
        db.query('SELECT CId, LoginId, FirstName, LastName, Contact, Email FROM Customer ORDER BY CId DESC', (err, customers) => {
            if (err) {
                console.error('❌ Error fetching customers:', err.message);
                db.end();
                return;
            }
            console.log('\n📋 All Customers:');
            if (customers.length === 0) {
                console.log('   (No customers found)');
            } else {
                customers.forEach(c => {
                    console.log(`   - ID: ${c.CId}, Login: ${c.LoginId}, Name: ${c.FirstName} ${c.LastName || ''}, Contact: ${c.Contact}, Email: ${c.Email}`);
                });
            }
            db.end();
        });
    });
});

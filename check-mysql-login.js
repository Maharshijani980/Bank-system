const mysql = require("mysql2");

const candidates = [
  { user: "root", password: "" },
  { user: "root", password: "root" },
  { user: "root", password: "admin" },
  { user: "root", password: "password" },
  { user: "root", password: "1234" },
  { user: "root", password: "12345" },
  { user: "root", password: "123456" },
  { user: "root", password: "mysql" },
  { user: "root", password: "Rj12345@" },
  { user: "admin", password: "admin" },
  { user: "admin", password: "" },
];

function tryOne(index) {
  if (index >= candidates.length) {
    console.log("No candidate credentials worked.");
    process.exit(1);
    return;
  }

  const cred = candidates[index];
  const conn = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: cred.user,
    password: cred.password,
  });

  conn.connect((err) => {
    if (err) {
      console.log(`FAIL user=${cred.user}, pass=${JSON.stringify(cred.password)} -> ${err.code}`);
      conn.destroy();
      tryOne(index + 1);
      return;
    }

    console.log(`SUCCESS user=${cred.user}, pass=${JSON.stringify(cred.password)}`);
    conn.end(() => process.exit(0));
  });
}

tryOne(0);

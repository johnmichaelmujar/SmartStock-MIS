import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to XAMPP MySQL successfully!");
    connection.release();
  } catch (err) {
    console.error(
      "Database Connection Failed! Is XAMPP MySQL running? Error: ",
      err.message,
    );
  }
})();

export default pool;

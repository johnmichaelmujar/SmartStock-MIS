import express from "express";
import cors from "cors";
import pool from "./db.js";
import ExcelJS from "exceljs";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Your backend is connected!" });
});

// CONNECTION TEST
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS db_time");

    console.log(`Connection active. Current DB Time: ${rows[0].db_time}`);

    res.json({
      status: "connected",
      message: "Database is active",
      databaseTime: rows[0].db_time,
    });
  } catch (error) {
    console.error("[Database Log Error] Connection failed:", error.message);

    res.status(500).json({
      status: "error",
      message: "Failed to communicate with the database.",
      error: error.message,
    });
  }
});

// MAIN FEATURES
// LOGIN
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await pool.query(
      "SELECT id, name, role FROM Users WHERE name = ? AND password_hash = ?",
      [username, password],
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const loggedInUser = users[0];
    res.json({
      success: true,
      message: "Login successful! 🎉",
      user: {
        id: loggedInUser.id,
        name: loggedInUser.name,
        role: loggedInUser.role,
      },
    });
  } catch (error) {
    console.error("Login route error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error during login." });
  }
});

// INVENTORY
// 1. GET ALL PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Products ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. ADD NEW PRODUCT
app.post("/api/products", async (req, res) => {
  const { name, category, price, qty, dateAdded, expiry } = req.body;
  try {
    const query = `INSERT INTO Products (name, category, price, qty, dateAdded, expiry) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(query, [
      name,
      category,
      price,
      qty,
      dateAdded,
      expiry,
    ]);
    res.json({
      success: true,
      message: "Product added!",
      insertId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. UPDATE EXISTING PRODUCT
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, price, qty, expiry } = req.body;
  try {
    const query = `UPDATE Products SET name = ?, category = ?, price = ?, qty = ?, expiry = ? WHERE id = ?`;
    await pool.query(query, [name, category, price, qty, expiry, id]);
    res.json({ success: true, message: "Product updated!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. DELETE PRODUCT
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Products WHERE id = ?", [id]);
    res.json({ success: true, message: "Product deleted." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// SALES

app.get("/api/sales", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM sales ORDER BY datetime DESC",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/sales", async (req, res) => {
  const { productId, productName, category, qty, price, total, datetime } =
    req.body;
  let formattedDateTime = datetime
    ? new Date(datetime).toISOString().slice(0, 19).replace("T", " ")
    : new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    await pool.query(
      "INSERT INTO sales (datetime, productName, category, qty, price, total) VALUES (?, ?, ?, ?, ?, ?)",
      [formattedDateTime, productName, category, qty, price, total],
    );
    await pool.query("UPDATE products SET qty = qty - ? WHERE id = ?", [
      qty,
      productId,
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Example of how to make your DELETE atomic using transactions
app.delete("/api/sales/:id", async (req, res) => {
  const saleId = req.params.id;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Get the data first
    const [rows] = await connection.query(
      "SELECT qty, productName FROM sales WHERE id = ?",
      [saleId],
    );
    if (rows.length === 0) {
      throw new Error("Sale not found");
    }

    const { qty, productName } = rows[0];

    // 2. Update the product inventory
    await connection.query(
      "UPDATE products SET qty = qty + ? WHERE name = ? OR name = ?",
      [qty, productName, productName],
    );

    // 3. Delete the sales record
    await connection.query("DELETE FROM sales WHERE id = ?", [saleId]);

    // 4. Commit all changes
    await connection.commit();
    res.json({ success: true });
  } catch (err) {
    await connection.rollback(); // Undo everything if any query fails
    console.error("❌ Transaction Failed:", err.message);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    connection.release(); // Always clean up the connection
  }
});

// EXPENSES

// Fetch all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM expenses ORDER BY date DESC",
    );
    // Map DB column 'description' to 'desc' for the frontend
    const mapped = rows.map((r) => ({ ...r, desc: r.description }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save or Update Expense
app.post("/api/expenses", async (req, res) => {
  const { id, desc, category, amount, date } = req.body;

  try {
    if (id && id !== "") {
      console.log("✏️ Updating expense ID:", id);
      const sql =
        "UPDATE expenses SET description=?, category=?, amount=?, date=? WHERE id=?";
      await pool.query(sql, [desc, category, amount, date, id]);
      res.json({ success: true, message: "Updated" });
    } else {
      console.log("➕ Creating new expense");
      const sql =
        "INSERT INTO expenses (description, category, amount, date) VALUES (?, ?, ?, ?)";
      await pool.query(sql, [desc, category, amount, date]);
      res.json({ success: true, message: "Created" });
    }
  } catch (err) {
    console.error("❌ SQL Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM expenses WHERE id = ?", [id]);
    res.json({ success: true, message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REPORT GENERATION

app.get("/api/reports/download", async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();

    // 1. Fetch Data
    const [products] = await pool.query("SELECT * FROM products");
    const [sales] = await pool.query("SELECT * FROM sales");
    const [expenses] = await pool.query("SELECT * FROM expenses");

    // 2. Inventory Sheet
    const invSheet = workbook.addWorksheet("Inventory");
    invSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Product Name", key: "name" }, // Correct column from SQL
      { header: "Category", key: "category" },
      { header: "Price", key: "price" },
      { header: "Quantity", key: "qty" },
      { header: "Date Added", key: "dateAdded" },
    ];
    invSheet.addRows(products);

    // 3. Sales Sheet
    const salesSheet = workbook.addWorksheet("Sales");
    salesSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Date", key: "datetime" },
      { header: "Product", key: "productName" },
      { header: "Category", key: "category" },
      { header: "Qty", key: "qty" },
      { header: "Price", key: "price" },
      { header: "Total", key: "total" },
    ];
    salesSheet.addRows(sales);

    // 4. Expenses Sheet
    const expSheet = workbook.addWorksheet("Expenses");
    expSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Description", key: "description" },
      { header: "Category", key: "category" },
      { header: "Amount", key: "amount" },
      { header: "Date", key: "date" },
    ];
    expSheet.addRows(expenses);

    // 5. Send File
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Full_Report.xlsx",
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Report error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate report" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running smoothly on http://localhost:${PORT}`);
});

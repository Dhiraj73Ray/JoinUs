require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const axios = require("axios");

const app = express();

// --- Database config (override with environment variables in production) ---
const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "join_us",
};

// --- Middleware ---
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// --- Database connection ---
const connection = mysql.createConnection(DB_CONFIG);
connection.connect((error) => {
  if (error) {
    console.error("DB connection failed:", error.message);
  } else {
    console.log("Database connected");
  }
});

// --- Routes ---

// Home: display user count + signup form
app.get("/", (req, res) => {
  connection.query("SELECT COUNT(*) AS count FROM users", (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Database error");
    }
    res.render("join", { data: results[0].count });
  });
});

// Register: validate email, check duplicate, insert
app.post("/register", (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();

  // 1. Empty check
  if (!email) {
    return res.status(400).send("Email field cannot be empty");
  }

  // 2. Format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send("Invalid email format");
  }

  // 3. Allowed providers check
  const allowedProviders = [
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
    "aol.com", "icloud.com", "protonmail.com", "zoho.com",
    "gmx.com", "yandex.com", "mail.com", "rediffmail.com",
  ];
  const domain = email.split("@")[1];
  if (!allowedProviders.includes(domain)) {
    return res.status(400).send("Email provider not allowed");
  }

  // 4. Duplicate check → INSERT (nested = safe from race conditions)
  connection.query("SELECT email FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Duplicate check error:", err);
      return res.status(500).send("Database error");
    }

    if (results.length > 0) {
      return res.status(400).send("Email address already exists");
    }

    connection.query("INSERT INTO users (email) VALUES (?)", [email], (err2) => {
      if (err2) {
        console.error("Insert error:", err2);
        return res.status(500).send("Database error");
      }
      res.redirect("/");
    });
  });
});

// --- Fun routes ---
app.get("/joke", async (req, res) => {
  try {
    const response = await axios.get(
      "https://official-joke-api.appspot.com/random_joke"
    );
    res.send(`${response.data.setup}\n${response.data.punchline}`);
  } catch (error) {
    res.status(500).send("Error fetching a joke");
  }
});

app.get("/lucky", (req, res) => {
  res.send("Your lucky number is: " + Math.random());
});

// --- Start server ---
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


// taskkill /F /PID 9004
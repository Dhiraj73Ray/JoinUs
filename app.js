const express = require("express");
const serverless = require("serverless-http");
const path = require("path"); // Require the path module
const bodyparser = require("body-parser");
const app = express();
// const axios = require('axios');
// const faker = require("@faker-js/faker")
const mysql = require("mysql");
const router = express.Router();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Set the views directory and view engine
app.set("views", path.join(__dirname,  "views"));
app.set("view engine", "ejs");


app.use(bodyparser.urlencoded({ extended: true }));

// "axios": "^1.6.7",
// "body-parser": "^1.20.2",
// "ejs": "^3.1.9",
// "express": "^4.18.2",
// "mysql": "^2.18.1"

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Admin@123",
  database: "join_us",
});

connection.connect(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("Database Connected");
  }
});

app.get("/", (req, res) => {
  connection.query(
    "select count(*) as count from users",
    function (error, results) {
      if (error) throw error;
      const user = results[0].count;
      res.render("join", { data: user });
    }
  );
});


app.post("/register", function (req, res) {
  const email = req.body.email.trim(); // Trim whitespace from the email
  
  // Check if the email field is empty
  if (!email) {
    return res.status(400).send("Email field cannot be empty");
  }

   // Regular expression for validating email format
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
// Check if the email domain matches any of the allowed providers
const allowedProviders = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "icloud.com", "protonmail.com", "zoho.com", "gmx.com", "yandex.com", "mail.com", "rediffmail.com", "fastmail.com", "tutanota.com", "hushmail.com"];
const domain = email.split("@")[1];
if (!allowedProviders.includes(domain)) {
     return res.status(400).send("Invalid email address format");
   }

// Check if the email already exists in the database
connection.query("SELECT * FROM users WHERE email = ?", [email], function (error, results) {
  if (error) {
    console.log("Error checking for existing user:", error);
    return res.status(500).send("An error occurred while processing your request");
  }

  if (results.length > 0) {
    // Email already exists in the database
    return res.status(400).send("Email address already exists");
  }
})
   
  var person = {
    email: email
  };

  connection.query("INSERT INTO USERS SET ?", person, function (error, results) {
    if (error) {
      console.log("Error inserting user:", error);
      return res.status(500).send("An error occurred while processing your request");
    }
    
    // Successful insertion
    res.redirect('/');
  });
});


app.get("/joke", async (req, res) => {
  try {
    const response = await axios.get(
      "https://official-joke-api.appspot.com/random_joke"
    );
    res.send(response.data.setup + "\n" + response.data.punchline);
  } catch (error) {
    res.status(500).send("Error fetching a joke");
  }
});


app.get("/lucky", (req, res) => {
  var num = Math.random();
  res.send("Your lucky number is: " + num);
});

app.listen(4200, () => {
  console.log("listening to port 4200.....");
  console.log(__dirname)
});

app.use("/.netlify/function/api", router);
module.exports.handler = serverless(app)

// taskkill /F /PID 9004
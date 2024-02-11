# JOIN US
<h3>This is a node_express app. Simply made for illustrating the connection between MySQL and Node.js</h3>

## Step 1
Download & install [Node.js](https://nodejs.org/en/download/)  and  [MySQL](https://dev.mysql.com/downloads/installer/) 

## Step 2
This is the [Requirements.txt](https://github.com/Dhiraj73Ray/JoinUs/blob/main/requirements.txt) file. After extracting this folder first install all dependencies.

## Step 3
  - Create a database and table(write query in MySQL)
```
CREATE DATABASE JOIN_US;
USE JOIN_US;

CREATE TABLE USER
(
  EMAIL VARCHAR(500) PRIMARY KEY,
  CREATED_AT TIMESTAMP DEFAULT NOW()
);

INSERT INTO USER(EMAIL) VALUES
  ("ZINGHANG@GMAIL.COM"),
  ("SUEDAVID@GMAIL.COM"),
  ("FARAHNKUMARI@HOTMAIL.COM"),
  ("RAM2190@GMAIL.COM");

SELECT * FROM USER;
```
  - Make Connection Mysql with Node.js
  - Insert bulk entries as many you want (in app.js  file)
```
var data = [];
for (var i = 0; i < 500; i++){
  data.push([
    email: faker.internet.email(),
    created_at: faker.date.past()
  ])
}

var q = "INSERT INTO USER (EMAIL, CREATED_AT) VALUES ?";

connection.query(q, data, function(err, result) {
   if (error) throw error;
   console.log(result);
 });
```

## Step 4
Done just run the command
```
node app.js
```

##



### There also a joke route where you can read different jokes everytime
```
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
```

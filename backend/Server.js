"use strict";

// // load package
// const express = require("express");
// const app = express();

// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// const cors = require("cors");
// app.use(cors());

// const PORT = 3080;
// const HOST = "0.0.0.0";
// // Data
// let data = [
//   {
//     id: 1,
//     text: "bla 1",
//     time: "9:00",
//   },
//   {
//     id: 2,
//     text: "bla, blai 2",
//     time: "9:02",
//   },
//   {
//     id: 3,
//     text: "bla, bla,blai 3",
//     time: "9:05",
//   },
// ];
// app.get("/data", (req, res) => {
//   res.json(data);
// });

// app.post("/add", (req, res) => {
//   let id = req.body.id;
//   let text = req.body.text;
//   let time = req.body.time;
//   data.push({ id: id, text: text, time: time });
//   res.json(data);
// });
// app.listen(PORT, HOST);

// console.log("up and running");

// load package
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const PORT = 3000;
const HOST = "0.0.0.0";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Database Connection
const connection = mysql.createConnection({
  // host: '0.0.0.0'/localhost: Used to  locally run app
  host: "mysql1",
  user: "root",
  password: "admin",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Server!");
});

app.get("/init", (req, res) => {
  // Create employeedb database and employeetable table (existing code)
  connection.query(
    `CREATE DATABASE IF NOT EXISTS postdb`,
    function (error, result) {
      if (error) console.log(error);
    }
  );
  //Create Table
  connection.query(`USE postdb`, function (error, results) {
    if (error) console.log(error);
  });
  connection.query(
    `CREATE TABLE IF NOT EXISTS posts
    ( id int unsigned NOT NULL auto_increment,
    title varchar(100)NOT NULL,
    body text NOT NULL,
    PRIMARY KEY (id))`,
    function (error, result) {
      if (error) console.log(error);
    }
  );
  res.send("Database and Table created!");
});

//Insert into Table
app.post("/addPost", (req, res) => {
  const { topic, data } = req.body;
  const query = `INSERT INTO posts (title, body) VALUES ("${topic}", "${data}")`;
  connection.query(query, function (error, result) {
    if (error) console.log(error);
    res.json({ message: "New post inserted" });
  });
});

//Get all posts
app.get("/getPosts", (req, res) => {
  const sqlQuery = "SELECT * FROM posts";
  connection.query(sqlQuery, function (error, result) {
    if (error) console.log(error);
    res.json({ posts: result });
  });
});

// delete all posts
app.delete("/deleteAll", (req, res) => {
  connection.query("DELETE FROM posts", (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting posts" });
    } else {
      res.status(200).json({ message: "All posts deleted successfully" });
    }
  });
});

//serves the static files in the public folder
app.use("/", express.static("public"));
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const axios = require("axios");
const cache = require("memory-cache");
const app = express();
var bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;
const API_AWS = process.env.API_AWS;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", (req, res) => {
  res.json({ Hello: "XE API" });
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "xe",
});

// GET /properties
app.get("/properties", (req, res) => {
  connection.query("SELECT * FROM `properties`", function (err, results) {
    res.json(results);
  });
});

// POST /properties
app.post("/properties", function (req, res) {
  const property = req.body.property;
  const sql =
    "INSERT INTO properties (title, type, area, price, description) VALUES (?, ?, ?, ?, ?)";
  const values = [
    property.title,
    property.type,
    property.area,
    property.price,
    property.description,
  ];
  connection.query(sql, values, function (err, result) {
    if (err) throw err;
    return res.send("Property has been added successfully");
  });
});

// GET /areas
app.get("/areas", async (req, res) => {
  try {
    const { input } = req.query;
    const cacheKey = `areas:${input}`;
    // Check if the data is already in the cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit");
      res.json(cachedData);
    } else {
      console.log("Cache miss");
      try {
        const apiUrl = `${API_AWS}?input=${input}`;
        const response = await axios.get(apiUrl);
        // cache (TTL - 10 sec)
        cache.put(cacheKey, response.data, 10 * 1000);
        res.json(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.error("403 Forbidden error");
          res.status(403).json({ error: "Forbidden: Access Denied" });
        } else {
          console.error(error);
          res.status(500).json({ error: "Error fetching data" });
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.listen(port, () => {
  console.log(`XE API app listening at http://localhost:${port}`);
});

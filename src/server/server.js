const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// For authentications
const { authenticateToken } = require("./middleware/auth");

// const authRoutes = require("./routes/authRoutes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// For local .env
require("dotenv").config();
// console.log(process.env.PORT);

app.use(
  cors({
    origin: process.env.ORIGIN_URL, // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
    credentials: true, // Allow sending cookies
  })
);

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

const uri = process.env.MONGODB_URI;

// Database connection
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB.\n");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());

// Define and create mongoose schemas

require("./models/accountSchema");
require("./models/inventoryDataSchema");
require("./models/salesDataSchema");
require("./models/forecastSchema");
require("./models/forecastHistorySchema");

const Account = mongoose.model("Account");
const Inventory = mongoose.model("Inventory");
const Sales = mongoose.model("Sales");
const Forecast = mongoose.model("Forecast");
const ForecastHistories = mongoose.model("ForecastHistories");

// CRUD routes with filtering
function createCRUDRoutes(resource, resourceName, Model) {
  // GET all data with optional filtering
  app.get(`/${resource}`, authenticateToken, async (req, res) => {
    try {
      let filteredData = await Model.find();
      const filters = req.query;

      // Check for user_type, inventory_name, unit_name, or product_name filters
      if (
        filters.user_type ||
        filters.inventory_name ||
        filters.unit_name ||
        filters.product_name ||
        filters.report_type
      ) {
        filteredData = filteredData.filter((item) => {
          for (const key in filters) {
            if (
              key === "user_type" ||
              key === "inventory_name" ||
              key === "unit_name" ||
              key === "product_name" ||
              key === "report_type"
            ) {
              if (item[key] !== filters[key]) {
                return false; // Exclude if the item's value doesn't match the filter
              }
            }
          }
          return true; // Include if all filters match
        });
      }

      // Check for search keyword parameter
      if (req.query.search && req.query.search.keyword) {
        const keyword = req.query.search.keyword.toLowerCase();
        filteredData = filteredData.filter((item) => {
          for (const key in item) {
            if (
              typeof item[key] === "string" ||
              typeof item[key] === "number"
            ) {
              // Convert number to string for case-insensitive comparison
              if (item[key].toString().toLowerCase().includes(keyword)) {
                return true;
              }
            }
          }
          return false;
        });
      }

      // Check for date range parameters
      if (req.query.date_gte && req.query.date_lte) {
        const gteDateParts = req.query.date_gte.split("-").map(Number);
        const lteDateParts = req.query.date_lte.split("-").map(Number);

        // Ensure both date parts have 2 elements (month and year)
        if (gteDateParts.length === 2 && lteDateParts.length === 2) {
          const gteMonth = gteDateParts[0];
          const gteYear = gteDateParts[1];
          const lteMonth = lteDateParts[0];
          const lteYear = lteDateParts[1];

          // Filter the data based on the date range
          filteredData = filteredData.filter((item) => {
            const itemDateParts = item.date.split("-").map(Number);
            if (itemDateParts.length === 2) {
              const itemMonth = itemDateParts[0];
              const itemYear = itemDateParts[1];

              // Compare the dates
              if (
                (itemYear > gteYear ||
                  (itemYear === gteYear && itemMonth >= gteMonth)) &&
                (itemYear < lteYear ||
                  (itemYear === lteYear && itemMonth <= lteMonth))
              ) {
                return true;
              }
            }
            return false;
          });
        } else {
          res.status(400).json({ error: "Invalid date format" });
          return;
        }
      }
      res.json(filteredData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET data by ID
  app.get(`/${resource}/:id`, authenticateToken, async (req, res) => {
    try {
      const resourceId = req.params.id;
      const resourceItem = await Model.findById(resourceId);
      if (resourceItem) {
        res.json(resourceItem);
      } else {
        res.status(404).json({ error: `${resourceName} not found` });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post(`/${resource}`, authenticateToken, async (req, res) => {
    if (resource === "accounts") {
      const {
        id,
        prefix,
        first_name,
        last_name,
        email_address,
        username,
        password,
        user_type,
      } = req.body;

      const encryptedPassword = await bcrypt.hash(password, 10);

      try {
        // Verify if the email already exists
        const existingUser = await Model.findOne({
          email_address: email_address,
        });
        if (existingUser) {
          return res.status(400).json({ error: "Email already exists" });
          // return res.json({ error: "User already exists." });
        }

        // Create a new user if the email doesn't exist
        const newResourceItem = await Model.create({
          id,
          prefix,
          first_name,
          last_name,
          email_address,
          username,
          password: encryptedPassword,
          user_type,
        });
        return res.status(201).json(newResourceItem);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    } else {
      try {
        const newResourceItem = await Model.create(req.body);
        return res.status(201).json(newResourceItem);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  });

  // PUT updated data by ID
  app.put(`/${resource}/:id`, authenticateToken, async (req, res) => {
    try {
      const resourceId = req.params.id;
      const updatedResourceItem = await Model.findByIdAndUpdate(
        resourceId,
        req.body,
        { new: true }
      );
      if (updatedResourceItem) {
        res.json(updatedResourceItem);
      } else {
        res.status(404).json({ error: `${resourceId} not found` });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE data by ID
  app.delete(`/${resource}/:id`, authenticateToken, async (req, res) => {
    try {
      const resourceId = req.params.id;
      // console.log(resourceId);
      const deletedResourceItem = await Model.findByIdAndDelete(resourceId);
      if (deletedResourceItem) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: `${resourceId} not found` });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // For prompting python/forecasting processes
  const { spawn } = require("child_process");

  app.post(`/${resource}/forecasting`, authenticateToken, async (req, res) => {
    try {
      const pythonProcess = spawn("python", ["./forecast/Forecasting.py"]);

      let scriptOutput = "";
      let scriptError = "";

      pythonProcess.stdout.on("data", (data) => {
        console.log(`Python script stdout: ${data.toString()}`);
        scriptOutput += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Python script stderr: ${data.toString()}`);
        scriptError += data.toString();
      });

      pythonProcess.on("error", (err) => {
        console.error("Failed to start subprocess.");
        res.status(500).json({
          message: "Failed to start forecasting process",
          error: err.message,
        });
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.log(`Python script exited with code ${code}`);
          res.status(500).json({
            message: `Python script exited with non-zero code: ${code}`,
            output: scriptOutput,
            errors: scriptError,
          });
        } else {
          res.json({
            message: "Python script completed successfully.",
            output: scriptOutput,
            errors: scriptError,
          });
        }
      });
    } catch (error) {
      console.error(`Error spawning Python script: ${error.message}`);
      res.status(500).json({
        message: "Error executing forecasting",
        error: error.message,
      });
    }
  });
}

// Define CRUD routes for each resource
createCRUDRoutes("accounts", "accounts", Account);
createCRUDRoutes("inventories", "inventories", Inventory);
createCRUDRoutes("sales", "sales", Sales);
createCRUDRoutes("forecasts", "forecasts", Forecast);
createCRUDRoutes("forecasthistories", "forecasthistories", ForecastHistories);

// Handler for when user is logging in
app.post("/logins", async (req, res) => {
  const emailOrUsername = req.body.emailOrUsername;
  const password = req.body.password;

  // console.log(emailOrUsername, password, Account);

  const existingUser = await Account.findOne({
    $or: [{ email_address: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!existingUser) {
    return res.status(404).json({ error: `${emailOrUsername} not found` });
  }

  if (await bcrypt.compare(password, existingUser.password)) {
    const token = jwt.sign(
      { userId: existingUser._id, userType: existingUser.user_type },
      process.env.TOKEN
      // { expiresIn: "1h" }
    );

    // console.log(existingUser.user_type);
    if (res.status(200)) {
      return res.json({
        user_type: existingUser.user_type,
        token,
        existingUser,
      });
    } else {
      res.status(401).json({ error: `${token} not found.` });
    }
  }

  return res
    .status(404)
    .json({ error: `Incorrect password for ${emailOrUsername}.` });
});

app.listen(port, () => {
  console.log(`\nServer listening on port ${port}`);
});

// Log and Print Accessed URL, and Method
app.use((req, res, next) => {
  console.log(`Accessed URL: ${req.method} ${req.originalUrl}`);
  next();
});

// backend.js
import express from "express";
import request from "axios";
import cors from "cors";
import { configDotenv } from "dotenv";

// Load environment variables
configDotenv();

const app = express();

// CORS Configuration: Allow specific origins without trailing slashes
const corsOptions = {
  origin: [
    "https://teamlead-vert.vercel.app",
    "http://localhost:5173", // Localhost for development testing
  ],
  methods: ["GET", "POST"],
  credentials: true, // Allow credentials in requests
};

app.use(cors(corsOptions)); // Apply CORS with the specified options
app.use(express.json());

// API route for fetching company data
app.get("/api/company-data", async (req, res) => {
  const domain = req.query.domain;

  // Check if domain is provided
  if (!domain) {
    return res.status(400).json({
      message: "Domain parameter is required.",
    });
  }

  const options = {
    method: "GET",
    url: "https://fresh-linkedin-profile-data.p.rapidapi.com/get-company-by-domain",
    params: { domain },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY, // Ensure this is set in Render
      "x-rapidapi-host": "fresh-linkedin-profile-data.p.rapidapi.com",
    },
  };

  try {
    // Make the API request
    const response = await request(options);
    res.json(response.data); // Send the fetched data as the response
  } catch (error) {
    console.error("Error fetching company data:", error); // Log the error
    res.status(error.response ? error.response.status : 500).json({
      message: "Error fetching company data",
      error: error.message, // Include the error message in the response
    });
  }
});

// Dynamic PORT binding for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

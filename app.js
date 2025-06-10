import express from "express";
import cors from "cors";
import emailRoutes from "./src/routes/emailRoutes.js";
import accountRoutes from "./src/routes/accountRoutes.js";

const app = express();

// CORS configuration
const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/emails", emailRoutes);
app.use("/api/accounts", accountRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/emails`);
});

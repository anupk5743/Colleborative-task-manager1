/**
 * Environment configuration
 * All environment variables are validated here
 */

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/task-manager",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",
  NODE_ENV: process.env.NODE_ENV || "development",
};

export const validateEnv = () => {
  const required = ["MONGO_URI", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

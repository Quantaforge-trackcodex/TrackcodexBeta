import dotenv from "dotenv";
import path from "path";

console.log("Loading .env...");
const result = dotenv.config({ path: path.join(process.cwd(), ".env") });

if (result.error) {
  console.error("Error loading .env:", result.error);
} else {
  console.log(".env loaded successfully.");
}

console.log(
  "GITHUB_CLIENT_ID:",
  process.env.GITHUB_CLIENT_ID ? "PRESENT" : "MISSING",
);
console.log(
  "GITHUB_CLIENT_SECRET:",
  process.env.GITHUB_CLIENT_SECRET ? "PRESENT" : "MISSING",
);
console.log(
  "VITE_GITHUB_CLIENT_ID:",
  process.env.VITE_GITHUB_CLIENT_ID ? "PRESENT" : "MISSING",
);

console.log("Raw GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID);

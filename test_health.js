const fetch = require("node-fetch"); // unlikely to have node-fetch in raw node, use http
const http = require("http");

http
  .get("http://localhost:3001/api/v1/health", (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      console.log("Status:", res.statusCode);
      console.log("Body:", data);
    });
  })
  .on("error", (err) => {
    console.log("Error:", err.message);
  });

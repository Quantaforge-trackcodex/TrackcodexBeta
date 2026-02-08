const http = require("http");

const data = JSON.stringify({
  email: "test_debug_" + Date.now() + "@example.com",
  password: "password123",
  username: "test_user_" + Date.now(),
  name: "Debug User",
  country: "US",
});

const options = {
  hostname: "localhost",
  port: 4000, // Probe backend directly
  path: "/api/v1/auth/register",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

console.log("Sending request to http://localhost:4000/api/v1/auth/register");

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

  let body = "";
  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    console.log("BODY:");
    console.log(body);
  });
});

req.on("error", (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();

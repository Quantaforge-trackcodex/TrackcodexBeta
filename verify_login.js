const http = require("http");

const data = JSON.stringify({
  email: "dev@trackcodex.dev",
  password: "password",
});

const options = {
  hostname: "127.0.0.1",
  port: 4000,
  path: "/api/v1/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let body = "";
  res.on("data", (chunk) => (body += chunk));
  res.on("end", () => {
    console.log("BODY:", body);
    if (res.statusCode === 200) {
      console.log("SUCCESS: Login works!");
      process.exit(0);
    } else {
      console.error("FAILURE: Login failed");
      process.exit(1);
    }
  });
});

req.on("error", (e) => {
  console.error(`ERROR: ${e.message}`);
  process.exit(1);
});

req.write(data);
req.end();

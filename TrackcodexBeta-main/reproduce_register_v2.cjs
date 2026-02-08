const http = require("http");

function testPort(port) {
  const data = JSON.stringify({
    email: "test_debug_" + Date.now() + "@example.com",
    password: "password123",
    username: "test_user_" + Date.now(),
    name: "Debug User",
    country: "US",
  });

  const options = {
    hostname: "localhost",
    port: port,
    path: "/api/v1/auth/register",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  console.log(
    `Sending request to http://localhost:${port}/api/v1/auth/register`,
  );

  const req = http.request(options, (res) => {
    console.log(`PORT ${port} STATUS: ${res.statusCode}`);

    let body = "";
    res.on("data", (chunk) => {
      body += chunk;
    });
    res.on("end", () => {
      console.log(`PORT ${port} BODY: ${body.substring(0, 500)}...`);
    });
  });

  req.on("error", (e) => {
    console.log(`PORT ${port} ERROR: ${e.message}`);
  });

  req.write(data);
  req.end();
}

testPort(3001); // Proxy
testPort(4000); // Backend direct

const http = require("http");

function makeRequest(path, port = 3001) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: port,
        path: path,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({ status: res.statusCode, body: data });
        });
      },
    );

    req.on("error", (e) => {
      resolve({ error: e.message });
    });
    req.end();
  });
}

async function run() {
  console.log("--- Diagnostics ---");

  // 1. Check Root API on Frontend Proxy
  console.log("\n1. Checking GET http://localhost:3001/api/v1/ (Proxy)");
  const root = await makeRequest("/api/v1/");
  console.log(`Status: ${root.status}`);
  console.log(`Body: ${root.body}`);

  // 2. Check Auth Health on Proxy
  console.log(
    "\n2. Checking GET http://localhost:3001/api/v1/auth/health (Proxy)",
  );
  const health = await makeRequest("/api/v1/auth/health");
  console.log(`Status: ${health.status}`);
  console.log(`Body: ${health.body}`);

  // 3. Check Auth Health DIRECTLY on Backend
  console.log(
    "\n3. Checking GET http://localhost:4000/api/v1/auth/health (Direct)",
  );
  const healthDirect = await makeRequest("/api/v1/auth/health", 4000);
  console.log(`Status: ${healthDirect.status}`);
  console.log(`Body: ${healthDirect.body}`);
  if (healthDirect.error) console.log(`Error: ${healthDirect.error}`);
}

run();

const { Client } = require("pg");
const client = new Client({
  connectionString: "postgresql://postgres:password@127.0.0.1:5434/trackcodex",
});

client
  .connect()
  .then(() => {
    console.log("SUCCESS: Connected to PostgreSQL from host!");
    return client.query("SELECT 1");
  })
  .then((res) => {
    console.log("QUERY SUCCESS:", res.rows[0]);
    process.exit(0);
  })
  .catch((err) => {
    console.error("FAILURE: Could not connect to PostgreSQL:", err.message);
    process.exit(1);
  });

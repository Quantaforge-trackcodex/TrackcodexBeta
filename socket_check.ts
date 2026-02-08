import net from "net";

const port = 5434;
const hosts = ["localhost", "127.0.0.1", "::1"];

hosts.forEach((host) => {
  const socket = new net.Socket();
  const startTime = Date.now();

  socket.setTimeout(2000);

  socket.on("connect", () => {
    console.log(
      `✅ SUCCESS: Connected to ${host}:${port} in ${Date.now() - startTime}ms`,
    );
    socket.destroy();
  });

  socket.on("timeout", () => {
    console.log(`❌ TIMEOUT: Failed to connect to ${host}:${port}`);
    socket.destroy();
  });

  socket.on("error", (err) => {
    console.log(
      `❌ ERROR: Failed to connect to ${host}:${port} - ${err.message}`,
    );
    socket.destroy();
  });

  socket.connect(port, host);
});

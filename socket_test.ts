import net from "net";

const checkPort = (port: number, host: string) => {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const timeout = 5000;

    socket.setTimeout(timeout);
    console.log(`Checking TCP connection to ${host}:${port}...`);

    socket.on("connect", () => {
      console.log(`SUCCESS: Connected to ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      console.log(`FAILURE: Connection to ${host}:${port} timed out`);
      socket.destroy();
      resolve(false);
    });

    socket.on("error", (err) => {
      console.log(
        `FAILURE: Connection to ${host}:${port} failed: ${err.message}`,
      );
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
};

async function run() {
  await checkPort(5434, "127.0.0.1");
  await checkPort(5434, "localhost");
}

run();

import DockerModule from "dockerode";
const Docker = (DockerModule as any).default || DockerModule;
import path from "path";
import fs from "fs/promises";

import process from "process";

export const docker = new Docker(
  process.platform === "win32"
    ? { socketPath: "//./pipe/docker_engine" }
    : undefined,
);

export class DockerService {
  // Create a new container for a workspace
  static async createContainer(
    workspaceId: string,
    image: string = "gitpod/openvscode-server:latest",
    port: number = 3000,
  ) {
    const workspacePath = path.resolve(
      process.cwd(),
      "workspaces",
      workspaceId,
    );

    // Ensure workspace dir exists
    try {
      await fs.mkdir(workspacePath, { recursive: true });
    } catch (e) {
      console.error("Failed to create workspace dir", e);
    }

    const name = `trackcodex-${workspaceId}`;

    // Remove existing if any
    try {
      const old = docker.getContainer(name);
      await old.remove({ force: true });
    } catch (e) {
      // Ignore if not found
    }

    // Ensure image exists
    try {
      const imageInspect = await docker.getImage(image).inspect();
    } catch (e) {
      console.log(`Pulling image ${image}... this may take a while.`);
      await new Promise((resolve, reject) => {
        docker.pull(image, (err: any, stream: any) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, onFinished, onProgress);
          function onFinished(err: any, output: any) {
            if (err) return reject(err);
            resolve(output);
          }
          function onProgress(event: any) {
            // console.log(event);
          }
        });
      });
    }

    const container = await docker.createContainer({
      Image: image,
      name: name,
      Tty: true,
      ExposedPorts: {
        "3000/tcp": {},
      },
      HostConfig: {
        // Bind container port 3000 to dynamic host port
        PortBindings: {
          "3000/tcp": [{ HostPort: port.toString() }],
        },
        // Mount local workspace folder
        Binds: [
          `${workspacePath}:/home/workspace`,
          // Inject default settings for parity
          `${path.resolve(process.cwd(), "config", "default-settings.json")}:/home/workspace/.vscode/settings.json`,
          // branding override (Attempt to override)
          `${path.resolve(process.cwd(), "config", "product.json")}:/home/workspace/product.json`,
        ],
        AutoRemove: true,
      },
      Env: [
        "CONNECTION_TOKEN=trackcodex-secure-token", // Secure access in production
        "OPENVSCODE_SERVER_ROOT=/home/workspace",
        // Force theme (Note: OpenVSCode uses browser storage for some things, but file overrides help)
        'EXTENSIONS_GALLERY={"serviceUrl":"https://open-vsx.org/vscode/gallery","itemUrl":"https://open-vsx.org/vscode/item"}',
      ],
      // Command to start server without auth for local dev ease, or use token
      // Command to start server without auth for local dev ease, or use token
      // Pre-install critical extensions for Antigravity Parity
      Cmd: [
        "--port",
        "3000",
        "--host",
        "0.0.0.0",
        "--without-connection-token",
        "--telemetry-level",
        "off",
        "--install-extension",
        "dbaeumer.vscode-eslint",
        "--install-extension",
        "esbenp.prettier-vscode",
        "--install-extension",
        "ms-python.python",
        "--install-extension",
        "bradlc.vscode-tailwindcss",
        "/home/workspace",
      ],
    });

    await container.start();
    return { containerId: container.id, name, port };
  }

  // Execute command
  static async exec(containerId: string, cmd: string[]) {
    const container = docker.getContainer(containerId);
    const exec = await container.exec({
      Cmd: cmd,
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: false });

    return new Promise<string>((resolve, reject) => {
      let output = "";
      container.modem.demuxStream(
        stream,
        {
          write: (chunk: Buffer) => (output += chunk.toString()),
        },
        {
          write: (chunk: Buffer) => (output += chunk.toString()),
        },
      );
      stream.on("end", () => resolve(output));
    });
  }

  // Stop
  static async stop(containerId: string) {
    const container = docker.getContainer(containerId);
    await container.stop();
  }

  /**
   * Run an ephemeral job container (CI/CD)
   */
  static async runEphemeralJob(
    jobId: string,
    image: string,
    commands: string[],
    env: string[] = [],
    onLog?: (chunk: string) => void,
  ): Promise<{ exitCode: number; logs: string }> {
    const name = `job-${jobId}-${Date.now()}`;
    let fullLogs = "";

    try {
      // Ensure image (simplified pull)
      // ... (reuse pull logic or start immediately)

      const container = await docker.createContainer({
        Image: image,
        name,
        Env: env,
        Tty: true,
        Cmd: ["/bin/sh", "-c", commands.join(" && ")], // Simple shell chaining
        HostConfig: { AutoRemove: true },
      });

      await container.start();

      const stream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
      });

      // specific typing for dockerode stream
      (stream as any).on("data", (chunk: Buffer) => {
        const str = chunk.toString();
        fullLogs += str;
        if (onLog) onLog(str);
      });

      const result = await container.wait();
      return { exitCode: result.StatusCode, logs: fullLogs };
    } catch (e) {
      console.error("Ephemeral Job Error:", e);
      throw e;
    }
  }
}

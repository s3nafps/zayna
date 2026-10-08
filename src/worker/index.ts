import { connect } from "node:net";

// Phase 1 wiring only. BullMQ queues and jobs arrive in Phase 4 (brief §7).
// The URL is never logged, because it can contain a password.

const REDIS_TIMEOUT_MS = 2000;

function checkRedis(redisUrl: string): Promise<boolean> {
  const url = new URL(redisUrl);
  const port = Number(url.port || 6379);
  return new Promise((resolve) => {
    const socket = connect({ host: url.hostname, port });
    const finish = (ok: boolean) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(REDIS_TIMEOUT_MS);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

async function main(): Promise<void> {
  const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
  const reachable = await checkRedis(redisUrl);
  console.log(`worker: redis ${reachable ? "reachable" : "unreachable"}; no jobs registered until Phase 4`);

  // Keep the process alive. Docker stops it with SIGTERM.
  const heartbeat = setInterval(() => undefined, 60_000);
  const shutdown = () => {
    clearInterval(heartbeat);
    process.exit(0);
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((error: unknown) => {
  console.error("worker failed to start", error);
  process.exitCode = 1;
});

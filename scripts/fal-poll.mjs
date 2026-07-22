// Resilient re-poll for in-flight Kling jobs, then download the mp4s.
// NOTE: fal queue status/result URLs use the APP namespace (fal-ai/kling-video),
// not the full versioned model path used when submitting.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

function readFalKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  const line = readFileSync("/Users/inder/Claude/Projects/shared-keys/fal.env", "utf8")
    .split("\n")
    .find((l) => /^\s*FAL_KEY\s*=/.test(l));
  return line && line.split("=").slice(1).join("=").trim().replace(/^"|"$/g, "");
}
const FAL_KEY = readFalKey();
const HEADERS = { Authorization: `Key ${FAL_KEY}` };
const APP = "fal-ai/kling-video"; // queue namespace

const JOBS = [
  { name: "hero", request_id: "019f5881-c4df-7d92-b026-790983193a93" },
  { name: "spices", request_id: "019f5881-c4df-7d92-b026-79138de97066" },
];

async function getJson(url) {
  const res = await fetch(url, { headers: HEADERS });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* ignore */
  }
  return { ok: res.ok, status: res.status, json, text };
}

async function poll(job) {
  const base = `https://queue.fal.run/${APP}`;
  for (let i = 0; i < 100; i++) {
    const s = await getJson(`${base}/requests/${job.request_id}/status`);
    const st = s.json?.status;
    if (st === "COMPLETED") {
      const r = await getJson(`${base}/requests/${job.request_id}`);
      const url = r.json?.video?.url;
      if (!url) throw new Error(`${job.name}: no video url — ${r.text?.slice(0, 300)}`);
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      mkdirSync("public/video", { recursive: true });
      writeFileSync(`public/video/${job.name}.mp4`, buf);
      console.log(`✓ ${job.name}.mp4 (${(buf.length / 1024 / 1024).toFixed(2)} MB) ${url}`);
      return;
    }
    if (i === 0 || i % 6 === 0)
      console.log(`… ${job.name}: http=${s.status} status=${st ?? s.text?.slice(0, 120)}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`${job.name}: timed out`);
}

await Promise.all(JOBS.map(poll));
console.log("\nDone → public/video/");

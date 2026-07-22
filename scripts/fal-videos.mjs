// Animate the Lala Masala hero stills into cinematic loops via fal.ai Kling i2v.
// Usage: node scripts/fal-videos.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

function readFalKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  const line = readFileSync("/Users/inder/Claude/Projects/shared-keys/fal.env", "utf8")
    .split("\n")
    .find((l) => /^\s*FAL_KEY\s*=/.test(l));
  return line && line.split("=").slice(1).join("=").trim().replace(/^"|"$/g, "");
}
const FAL_KEY = readFalKey();
const HEADERS = { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" };
const MODEL = "fal-ai/kling-video/v1.6/pro/image-to-video";

const imageUrls = JSON.parse(readFileSync("scripts/fal-image-urls.json", "utf8"));

const JOBS = [
  {
    name: "hero",
    image_url: imageUrls["hero-scene"],
    prompt:
      "Very slow, smooth cinematic push-in over a candlelit Indian feast. Steam rises gently from the curry, candle flames flicker softly, delicate shallow depth of field, warm golden light. Elegant, calm, luxurious slow motion. No camera shake, no people, no text.",
  },
  {
    name: "spices",
    image_url: imageUrls["spices-burgundy"],
    prompt:
      "Whole Indian spices on deep burgundy velvet. Extremely subtle slow drift with fine golden dust particles floating and catching warm light, delicate slow parallax, gentle glow. Cinematic macro, calm and premium. No camera shake, no text.",
  },
];

async function submit(job) {
  const res = await fetch(`https://queue.fal.run/${MODEL}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      prompt: job.prompt,
      image_url: job.image_url,
      duration: "5",
      aspect_ratio: "16:9",
      cfg_scale: 0.5,
    }),
  });
  if (!res.ok) throw new Error(`${job.name} submit: ${res.status} ${await res.text()}`);
  const data = await res.json();
  console.log(`→ submitted ${job.name}  request_id=${data.request_id}`);
  return { ...job, request_id: data.request_id };
}

async function poll(job) {
  const base = `https://queue.fal.run/${MODEL}`;
  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const s = await (
      await fetch(`${base}/requests/${job.request_id}/status`, { headers: HEADERS })
    ).json();
    if (s.status === "COMPLETED") {
      const result = await (
        await fetch(`${base}/requests/${job.request_id}`, { headers: HEADERS })
      ).json();
      const url = result.video?.url;
      if (!url) throw new Error(`${job.name}: no video url ${JSON.stringify(result)}`);
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      mkdirSync("public/video", { recursive: true });
      writeFileSync(`public/video/${job.name}.mp4`, buf);
      console.log(`✓ ${job.name}.mp4  (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
      return url;
    }
    if (s.status === "IN_QUEUE" || s.status === "IN_PROGRESS") {
      if (i % 4 === 0) console.log(`… ${job.name}: ${s.status}`);
      continue;
    }
    throw new Error(`${job.name}: unexpected status ${JSON.stringify(s)}`);
  }
  throw new Error(`${job.name}: timed out`);
}

const submitted = await Promise.all(JOBS.map(submit));
await Promise.all(submitted.map(poll));
console.log("\nAll videos done → public/video/");

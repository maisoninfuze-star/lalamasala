// Luxury hero: floating spices MORPH into an elegant plated dish.
// Start-frame (spices) + end-frame (plated dish) → Kling image-to-video with a
// tail frame for a controlled transformation. Falls back to single-frame if the
// tail parameter isn't accepted.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

function readFalKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  const line = readFileSync("/Users/inder/Claude/Projects/shared-keys/fal.env", "utf8")
    .split("\n")
    .find((l) => /^\s*FAL_KEY\s*=/.test(l));
  return line && line.split("=").slice(1).join("=").trim().replace(/^"|"$/g, "");
}
const FAL_KEY = readFalKey();
const H = { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" };

const NEG =
  "text, watermark, logo, cartoon, illustration, floating dishes, plates flying, neon, oversaturated, distorted, deformed, warping faces, extra objects, plastic";

const FRAME_A =
  "Cinematic macro photograph of whole Indian spices suspended and floating in a dark elegant studio: green cardamom pods, cumin seeds, cloves, cinnamon sticks, coriander seeds, dried red chilli, star anise. Deep burgundy background, warm golden rim light, fine turmeric dust drifting through the light, shallow depth of field, volumetric lighting, film grain, photorealistic, premium food advertising, 16:9.";

const FRAME_B =
  "Cinematic hero shot of a single luxurious plated vegetarian Indian dish — creamy paneer butter masala in an elegant dark ceramic bowl, delicate gold leaf and saffron threads, fresh coriander, gentle rising steam. A few whole spices (star anise, green cardamom, cinnamon) rest on the dark burgundy stone surface. Warm candlelight, shallow depth of field, Michelin fine-dining plating, deep burgundy and saffron-gold palette, photorealistic, film grain, 16:9.";

const MOTION =
  "The floating whole spices slowly swirl and drift together, dissolving into fine glowing golden particles that gently settle and resolve into an elegant plated Indian dish with rising steam and saffron-gold garnish. Warm candlelight, deep burgundy tones, restrained gold highlights, shallow depth of field, cinematic realistic lighting, film grain. A seamless, sophisticated luxury transformation, like a high-end fragrance campaign.";

async function genFrame(name, prompt) {
  const res = await fetch("https://fal.run/fal-ai/flux-pro/v1.1-ultra", {
    method: "POST",
    headers: H,
    body: JSON.stringify({ prompt, aspect_ratio: "16:9", num_images: 1, output_format: "jpeg", negative_prompt: NEG }),
  });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status} ${await res.text()}`);
  const data = await res.json();
  const url = data.images?.[0]?.url;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  mkdirSync("public/img/brand", { recursive: true });
  writeFileSync(`public/img/brand/${name}.jpg`, buf);
  console.log(`✓ ${name} ${url}`);
  return url;
}

async function submit(body) {
  const res = await fetch("https://queue.fal.run/fal-ai/kling-video/v1.6/pro/image-to-video", {
    method: "POST", headers: H, body: JSON.stringify(body),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

async function poll(request_id) {
  const base = "https://queue.fal.run/fal-ai/kling-video";
  for (let i = 0; i < 150; i++) {
    const s = await (await fetch(`${base}/requests/${request_id}/status`, { headers: H })).json();
    if (s.status === "COMPLETED") {
      const r = await (await fetch(`${base}/requests/${request_id}`, { headers: H })).json();
      const url = r.video?.url;
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      mkdirSync("public/video", { recursive: true });
      writeFileSync("public/video/hero-lux.mp4", buf);
      console.log(`✓ hero-lux.mp4 (${(buf.length / 1048576).toFixed(2)} MB) ${url}`);
      return;
    }
    if (i % 4 === 0) console.log(`… ${s.status ?? "?"}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("timed out");
}

const a = await genFrame("hero-lux-start", FRAME_A);
const b = await genFrame("hero-lux-end", FRAME_B);

// Try start+tail interpolation; fall back to single start frame if rejected.
let r = await submit({ prompt: MOTION, image_url: a, tail_image_url: b, duration: "5", negative_prompt: NEG });
if (!r.ok) {
  console.log(`tail submit failed (${r.status}): ${r.text.slice(0, 160)} — retrying single-frame`);
  r = await submit({ prompt: MOTION, image_url: a, duration: "5", negative_prompt: NEG });
}
if (!r.ok) throw new Error(`submit failed: ${r.status} ${r.text}`);
const { request_id } = JSON.parse(r.text);
console.log(`submitted ${request_id}`);
await poll(request_id);
console.log("done → public/video/hero-lux.mp4");

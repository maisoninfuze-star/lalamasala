// Generate the new cinematic hero: floating-spices first frame (FLUX Ultra) →
// Kling image-to-video (slow forward dolly, 5s, 16:9). Correct queue namespace.
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

const FRAME_PROMPT =
  "Cinematic macro photograph of whole Indian spices suspended and floating in a dark elegant studio: green cardamom pods, cumin seeds, cloves, cinnamon sticks, coriander seeds, dried red chilli, star anise. Deep burgundy background, subtle warm golden rim light, fine turmeric and masala dust drifting through the light, shallow depth of field, volumetric lighting, subtle film grain, photorealistic, premium food advertising, moody and sophisticated, 16:9.";

const MOTION_PROMPT =
  "Slow forward dolly moving through the floating spices with a premium macro lens. The whole spices drift slowly with realistic weight and natural movement. Fine turmeric and masala particles float through warm golden light. Shallow depth of field, deep shadows, rich burgundy tones, restrained saffron-gold highlights, cinematic realistic lighting, film grain. The spices gradually drift toward the centre of the frame. Warm, mysterious, sophisticated, like a luxury fragrance campaign.";

async function genFrame() {
  const res = await fetch("https://fal.run/fal-ai/flux-pro/v1.1-ultra", {
    method: "POST",
    headers: H,
    body: JSON.stringify({
      prompt: FRAME_PROMPT,
      aspect_ratio: "16:9",
      num_images: 1,
      output_format: "jpeg",
      negative_prompt:
        "text, watermark, logo, letters, cartoon, illustration, floating food, dishes, plates, neon, oversaturated, distorted, deformed, cluttered, plastic",
    }),
  });
  if (!res.ok) throw new Error(`frame: HTTP ${res.status} ${await res.text()}`);
  const data = await res.json();
  const url = data.images?.[0]?.url;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  mkdirSync("public/img/brand", { recursive: true });
  writeFileSync("public/img/brand/spice-hero-frame.jpg", buf);
  console.log(`✓ first frame ${url}`);
  return url;
}

async function submitVideo(image_url) {
  const res = await fetch(
    "https://queue.fal.run/fal-ai/kling-video/v1.6/pro/image-to-video",
    {
      method: "POST",
      headers: H,
      body: JSON.stringify({
        prompt: MOTION_PROMPT,
        image_url,
        duration: "5",
        aspect_ratio: "16:9",
        negative_prompt: "text, logo, distortion, warping, morphing, cartoon, oversaturation",
      }),
    },
  );
  if (!res.ok) throw new Error(`submit: HTTP ${res.status} ${await res.text()}`);
  const { request_id } = await res.json();
  console.log(`✓ submitted i2v request ${request_id}`);
  return request_id;
}

async function pollDownload(request_id) {
  const base = "https://queue.fal.run/fal-ai/kling-video";
  for (let i = 0; i < 120; i++) {
    const s = await (await fetch(`${base}/requests/${request_id}/status`, { headers: H })).json();
    if (s.status === "COMPLETED") {
      const r = await (await fetch(`${base}/requests/${request_id}`, { headers: H })).json();
      const url = r.video?.url;
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      mkdirSync("public/video", { recursive: true });
      writeFileSync("public/video/spice-hero.mp4", buf);
      console.log(`✓ spice-hero.mp4 (${(buf.length / 1048576).toFixed(2)} MB) ${url}`);
      return;
    }
    if (i % 4 === 0) console.log(`… ${s.status ?? "?"}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("timed out");
}

const frameUrl = await genFrame();
const reqId = await submitVideo(frameUrl);
writeFileSync("scripts/hero-video-request.txt", reqId);
await pollDownload(reqId);
console.log("\nHero video ready → public/video/spice-hero.mp4");

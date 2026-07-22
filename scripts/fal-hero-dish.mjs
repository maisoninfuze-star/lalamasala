// New hero: a realistic, appetising butter-paneer (makhani) dish with subtle
// natural motion (rising steam, slow push-in) — NO morph, so the food stays
// real the whole time. Replaces the spices→dish morph that distorted the dish.
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

const DISH =
  "A realistic, appetising food photograph of butter paneer (paneer makhani) — soft cubes of Indian paneer cheese in a rich, glossy orange-red buttery tomato-cream gravy, a swirl of fresh cream on top, a sprinkle of kasoori methi and fresh coriander, a small pat of melting butter. Served in a dark ceramic bowl with a hammered copper rim, a piece of fresh naan resting at the edge of the frame. Gentle steam rising. A few whole spices (star anise, green cardamom, cinnamon stick) rest on the dark burgundy stone surface beside the bowl. Warm candlelight, natural soft shadows, shallow depth of field, shot on a 50mm lens, true-to-life colours, realistic food texture, subtle film grain, photojournalistic, restaurant quality. Rich but natural.";

const DISH_NEG =
  "oversaturated, neon, artificial, plastic, cgi, 3d render, cartoon, illustration, fake, glossy plastic, waxy, text, watermark, logo, deformed, warped, melting, chicken, meat, fish, egg, hands";

const MOTION =
  "Gentle wisps of steam rise slowly from the curry, the cream swirl glistens, and a very slow subtle cinematic camera push-in moves toward the bowl. Warm candlelight flickers softly. The food stays completely still and realistic. Shallow depth of field, photorealistic, film grain.";

const MOTION_NEG =
  "morphing, warping, deforming, melting, distortion, transformation, spinning, text, extra objects, hands, deformed food";

async function genFrame() {
  const res = await fetch("https://fal.run/fal-ai/flux-pro/v1.1-ultra", {
    method: "POST",
    headers: H,
    body: JSON.stringify({ prompt: DISH, aspect_ratio: "16:9", num_images: 1, output_format: "jpeg", negative_prompt: DISH_NEG }),
  });
  if (!res.ok) throw new Error(`frame: HTTP ${res.status} ${await res.text()}`);
  const url = (await res.json()).images?.[0]?.url;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  mkdirSync("public/img/brand", { recursive: true });
  writeFileSync("public/img/brand/hero-dish.jpg", buf);
  console.log(`✓ hero-dish.jpg ${url}`);
  return url;
}

async function submitVideo(image_url) {
  const res = await fetch("https://queue.fal.run/fal-ai/kling-video/v1.6/pro/image-to-video", {
    method: "POST",
    headers: H,
    body: JSON.stringify({ prompt: MOTION, image_url, duration: "5", negative_prompt: MOTION_NEG }),
  });
  if (!res.ok) throw new Error(`submit: ${res.status} ${await res.text()}`);
  return (await res.json()).request_id;
}

const frameUrl = await genFrame();
const rid = await submitVideo(frameUrl);
console.log("i2v submitted", rid);
const base = "https://queue.fal.run/fal-ai/kling-video";
for (let i = 0; i < 150; i++) {
  const s = await (await fetch(`${base}/requests/${rid}/status`, { headers: H })).json();
  if (s.status === "COMPLETED") {
    const url = (await (await fetch(`${base}/requests/${rid}`, { headers: H })).json()).video?.url;
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    mkdirSync("public/video", { recursive: true });
    writeFileSync("public/video/hero-dish.mp4", buf);
    console.log(`✓ hero-dish.mp4 (${(buf.length / 1048576).toFixed(2)} MB) ${url}`);
    break;
  }
  if (i % 4 === 0) console.log(`… ${s.status ?? "?"}`);
  await new Promise((r) => setTimeout(r, 5000));
}
console.log("done");

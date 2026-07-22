// Restore the spices→dish morph hero, but with an end dish that resembles
// classic butter chicken (vivid orange-red creamy gravy, cream swirls,
// coriander) — kept vegetarian (paneer makhani). Original generation, not a
// copy of any reference photo.
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
  "chicken, meat, fish, egg, oversaturated cartoon, neon, plastic, cgi, 3d render, illustration, fake, waxy, text, watermark, logo, deformed, warped, melting, hands";

const SPICES =
  "Cinematic macro photograph of whole Indian spices suspended and floating in a dark elegant studio: green cardamom, cumin, cloves, cinnamon sticks, coriander seeds, dried red chilli, star anise. Deep burgundy background, warm golden rim light, fine turmeric dust in the air, shallow depth of field, volumetric lighting, film grain, photorealistic, 16:9.";

const DISH =
  "A realistic, appetising food photograph of rich butter paneer makhani that looks just like classic butter chicken — soft paneer pieces in a vivid, glossy orange-red creamy tomato-butter gravy, elegant swirls of fresh cream drizzled across the top, generous fresh chopped coriander scattered over, thick and saucy. Served in a dark ceramic bowl. Gentle steam rising. A few whole spices (star anise, green cardamom) on the dark burgundy stone surface beside the bowl. Warm candlelight, shallow depth of field, 50mm lens, true-to-life colours, realistic food texture, subtle film grain, photojournalistic, restaurant quality.";

const MOTION =
  "The floating whole spices slowly swirl and drift together, dissolving into fine glowing golden particles that gently settle and resolve into a rich butter-chicken-style curry with cream swirls, fresh coriander and rising steam. Warm candlelight, deep burgundy tones, restrained gold highlights, shallow depth of field, realistic cinematic lighting, film grain. A seamless, sophisticated luxury transformation — the food is realistic and still at the end.";
const MOTION_NEG =
  "morphing food into wrong shapes, warping, deforming, melting, distortion, text, extra objects, hands, deformed food, chicken, meat";

async function gen(name, prompt) {
  const res = await fetch("https://fal.run/fal-ai/flux-pro/v1.1-ultra", {
    method: "POST",
    headers: H,
    body: JSON.stringify({ prompt, aspect_ratio: "16:9", num_images: 1, output_format: "jpeg", negative_prompt: NEG }),
  });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status} ${await res.text()}`);
  const url = (await res.json()).images?.[0]?.url;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  mkdirSync("public/img/brand", { recursive: true });
  writeFileSync(`public/img/brand/${name}.jpg`, buf);
  console.log(`✓ ${name}.jpg ${url}`);
  return url;
}

const [startUrl, endUrl] = await Promise.all([
  gen("hero-lux-start", SPICES),
  gen("hero-lux-end", DISH),
]);

const sub = await fetch("https://queue.fal.run/fal-ai/kling-video/v1.6/pro/image-to-video", {
  method: "POST",
  headers: H,
  body: JSON.stringify({ prompt: MOTION, image_url: startUrl, tail_image_url: endUrl, duration: "5", negative_prompt: MOTION_NEG }),
});
if (!sub.ok) throw new Error(`submit: ${sub.status} ${await sub.text()}`);
const rid = (await sub.json()).request_id;
console.log("morph submitted", rid);
const base = "https://queue.fal.run/fal-ai/kling-video";
for (let i = 0; i < 150; i++) {
  const s = await (await fetch(`${base}/requests/${rid}/status`, { headers: H })).json();
  if (s.status === "COMPLETED") {
    const url = (await (await fetch(`${base}/requests/${rid}`, { headers: H })).json()).video?.url;
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    mkdirSync("public/video", { recursive: true });
    writeFileSync("public/video/hero-lux.mp4", buf);
    console.log(`✓ hero-lux.mp4 (${(buf.length / 1048576).toFixed(2)} MB) ${url}`);
    break;
  }
  if (i % 4 === 0) console.log(`… ${s.status ?? "?"}`);
  await new Promise((r) => setTimeout(r, 5000));
}
console.log("done");

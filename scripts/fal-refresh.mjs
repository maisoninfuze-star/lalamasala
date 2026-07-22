// Refresh hero morph end-dish (more realistic) + generate better signature-dish
// photos. Then rebuild the spices→dish morph with the new realistic end frame.
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
  "oversaturated, neon, artificial, plastic, cgi, 3d render, cartoon, illustration, fake, glossy, waxy, text, watermark, logo, deformed, extra objects, cluttered";

async function gen(name, prompt, aspect, dir = "public/img/dishes") {
  const res = await fetch("https://fal.run/fal-ai/flux-pro/v1.1-ultra", {
    method: "POST",
    headers: H,
    body: JSON.stringify({ prompt, aspect_ratio: aspect, num_images: 1, output_format: "jpeg", negative_prompt: NEG }),
  });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status} ${await res.text()}`);
  const url = (await res.json()).images?.[0]?.url;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/${name}.jpg`, buf);
  console.log(`✓ ${name}.jpg ${url}`);
  return url;
}

const REAL = "Shot on a 50mm lens, warm candlelight, natural soft shadows, shallow depth of field, true-to-life colours, authentic restaurant plating, realistic food texture, subtle film grain, photojournalistic, appetising.";

const SPICES =
  "Cinematic macro photograph of whole Indian spices suspended and floating in a dark elegant studio: green cardamom, cumin, cloves, cinnamon sticks, coriander seeds, dried red chilli, star anise. Deep burgundy background, warm golden rim light, fine turmeric dust in the air, shallow depth of field, volumetric lighting, film grain, photorealistic, 16:9.";

const END_DISH =
  `A realistic, natural food photograph of paneer butter masala — soft cubes of paneer in a rich orange-red tomato-cream gravy in a dark ceramic bowl, a swirl of cream and fresh coriander, gentle steam rising, on a dark burgundy stone surface with a few whole spices (star anise, green cardamom, cinnamon) scattered nearby. ${REAL}`;

const SIGS = [
  ["sig-paneer-tikka", `Realistic food photograph of paneer tikka — char-grilled cubes of Indian paneer on skewers with smoky charred edges and red tandoori marinade, grilled bell peppers and onion, a lime wedge, on a dark slate plate. ${REAL}`],
  ["sig-malai-chaap", `Realistic food photograph of malai soya chaap — creamy grilled soy skewers with a pale malai marinade and light char, coriander and a dusting of chaat masala, on a dark ceramic plate. ${REAL}`],
  ["sig-daal-makhani", `Realistic food photograph of daal makhani — glossy black lentils in a rich buttery tomato gravy with a swirl of cream and a pat of butter, fresh coriander, in a rustic copper bowl on dark wood. ${REAL}`],
  ["sig-paneer-butter-masala", `Realistic food photograph of paneer butter masala — paneer cubes in a rich tomato-butter gravy with a cream swirl and coriander, in a dark bowl on a moody table. ${REAL}`],
];

// 1) Frames + signature photos (parallel).
const [startUrl, endUrl] = await Promise.all([
  gen("hero-lux-start", SPICES, "16:9", "public/img/brand"),
  gen("hero-lux-end", END_DISH, "16:9", "public/img/brand"),
  ...SIGS.map(([n, p]) => gen(n, p, "3:2")),
]).then((r) => [r[0], r[1]]);

// 2) Rebuild the morph (spices → realistic dish).
const MOTION =
  "The floating whole spices slowly swirl and drift together, dissolving into fine glowing golden particles that gently settle and resolve into an elegant plated paneer butter masala with rising steam and fresh coriander. Warm candlelight, deep burgundy tones, restrained gold highlights, shallow depth of field, realistic cinematic lighting, film grain. A seamless, sophisticated luxury transformation.";
const sub = await fetch("https://queue.fal.run/fal-ai/kling-video/v1.6/pro/image-to-video", {
  method: "POST", headers: H,
  body: JSON.stringify({ prompt: MOTION, image_url: startUrl, tail_image_url: endUrl, duration: "5", negative_prompt: NEG }),
});
if (!sub.ok) throw new Error(`morph submit: ${sub.status} ${await sub.text()}`);
const rid = (await sub.json()).request_id;
console.log("morph submitted", rid);
const base = "https://queue.fal.run/fal-ai/kling-video";
for (let i = 0; i < 150; i++) {
  const s = await (await fetch(`${base}/requests/${rid}/status`, { headers: H })).json();
  if (s.status === "COMPLETED") {
    const url = (await (await fetch(`${base}/requests/${rid}`, { headers: H })).json()).video?.url;
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    writeFileSync("public/video/hero-lux.mp4", buf);
    console.log(`✓ hero-lux.mp4 (${(buf.length / 1048576).toFixed(2)} MB) ${url}`);
    break;
  }
  if (i % 4 === 0) console.log(`… ${s.status ?? "?"}`);
  await new Promise((r) => setTimeout(r, 5000));
}
console.log("refresh done");

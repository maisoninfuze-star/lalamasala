// Generate the Lala Masala cinematic hero stills via fal.ai (FLUX 1.1 Pro Ultra).
// Usage: node scripts/fal-images.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

function readFalKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  const line = readFileSync("/Users/inder/Claude/Projects/shared-keys/fal.env", "utf8")
    .split("\n")
    .find((l) => /^\s*FAL_KEY\s*=/.test(l)); // ignore commented example lines
  return line && line.split("=").slice(1).join("=").trim().replace(/^"|"$/g, "");
}
const FAL_KEY = readFalKey();
if (!FAL_KEY) throw new Error("FAL_KEY not found");

const MODEL = "fal-ai/flux-pro/v1.1-ultra";

const NEG =
  "text, watermark, logo, letters, cartoon, illustration, neon colours, mandala pattern, cluttered, plastic, oversaturated, low quality, deformed, extra limbs, hands";

const JOBS = [
  {
    name: "hero-scene",
    prompt:
      "Cinematic fine-dining food photography of a luxurious vegetarian North Indian feast on a dark walnut table. Deep burgundy and wine-red palette with saffron and turmeric accents. Butter paneer curry in a hammered copper bowl, fresh garlic naan, a royal thali platter, vibrant chaat, paneer tikka skewers, small dishes of green and tamarind chutney, Indian sweets. Rising steam, warm candlelight, soft golden rim light, shallow depth of field, moody chiaroscuro, cream linen, editorial styling, ultra realistic, 8k, subtle film grain.",
  },
  {
    name: "spices-burgundy",
    prompt:
      "Macro cinematic still life of whole Indian spices scattered on deep burgundy velvet: green cardamom pods, cinnamon sticks, cloves, cumin seeds, dried red chillies, star anise. Warm golden directional light, soft long shadows, shallow depth of field, faint floating dust particles catching the light, luxurious and moody, dark background, ultra realistic, editorial.",
  },
  {
    name: "powder-sweep",
    prompt:
      "A dramatic elegant sweep of saffron and turmeric powder streaking across a deep burgundy background, warm amber and golden tones, fine powder billowing in the air with motion blur, cinematic studio lighting, refined and premium, dark background, ultra realistic, high detail.",
  },
];

async function generate(job) {
  const res = await fetch(`https://fal.run/${MODEL}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: job.prompt,
      aspect_ratio: "16:9",
      num_images: 1,
      output_format: "jpeg",
      enable_safety_checker: true,
      negative_prompt: NEG,
    }),
  });
  if (!res.ok) throw new Error(`${job.name}: HTTP ${res.status} ${await res.text()}`);
  const data = await res.json();
  const url = data.images?.[0]?.url;
  if (!url) throw new Error(`${job.name}: no image url — ${JSON.stringify(data)}`);
  const img = Buffer.from(await (await fetch(url)).arrayBuffer());
  mkdirSync("public/img/brand", { recursive: true });
  writeFileSync(`public/img/brand/${job.name}.jpg`, img);
  console.log(`✓ ${job.name}.jpg  (${(img.length / 1024).toFixed(0)} KB)  ${url}`);
  return url;
}

const urls = {};
for (const job of JOBS) {
  urls[job.name] = await generate(job);
}
writeFileSync("scripts/fal-image-urls.json", JSON.stringify(urls, null, 2));
console.log("\nAll images done. URLs saved to scripts/fal-image-urls.json");

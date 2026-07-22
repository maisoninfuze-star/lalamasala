// Wide "Build Your Thali" banner — a complete vegetarian thali built from the
// items on Lala Masala's actual menu (bread + rice + 3 curries + raita +
// dessert + papad/pickle), in the same dark aubergine/gold fine-dining look.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

function readFalKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  const line = readFileSync("/Users/inder/Claude/Projects/shared-keys/fal.env", "utf8")
    .split("\n").find((l) => /^\s*FAL_KEY\s*=/.test(l));
  return line && line.split("=").slice(1).join("=").trim().replace(/^"|"$/g, "");
}
const FAL_KEY = readFalKey();
const H = { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" };

const PROMPT =
  "A realistic, appetising food photograph of a complete luxurious Indian vegetarian thali, composed as a wide cinematic banner. A large dark hammered-brass and ceramic platter, generously filled, holding several small katori bowls of rich curries — glossy daal makhani with a cream swirl, creamy shahi paneer, spiced cholle chickpeas, deep-green palak paneer — a neat mound of fluffy basmati rice, a folded butter naan and a tandoori roti, a small bowl of cooling raita, a warm gulab jamun dessert, a crisp papad, a wedge of lemon, sliced onion and a spoon of mango pickle. Purely vegetarian, no meat. Premium restaurant menu food photography, abundant and freshly served, filling the frame. A warm, bright, flattering key light makes the food glow against a moody dark aubergine-and-burgundy background with soft golden candlelight (chiaroscuro). Gentle rising steam, fresh coriander garnish, shallow depth of field, shot on a 50mm lens, true-to-life appetising colours, realistic food texture, subtle film grain. Luxurious, warm and craveable.";

const NEG =
  "meat, chicken, fish, egg, prawn, sparse, tiny portions, empty platter, too dark, underexposed, dim, murky, dull, text, watermark, logo, poster, flyer, hands, fingers, deformed, cartoon, cgi, 3d render, plastic, oversaturated, neon";

const res = await fetch("https://fal.run/fal-ai/flux-pro/v1.1-ultra", {
  method: "POST", headers: H,
  body: JSON.stringify({ prompt: PROMPT, aspect_ratio: "21:9", num_images: 1, output_format: "jpeg", negative_prompt: NEG }),
});
if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
const url = (await res.json()).images?.[0]?.url;
const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
mkdirSync("public/img/dishes-lux", { recursive: true });
writeFileSync("public/img/dishes-lux/hero-thali.jpg", buf);
console.log("✓ hero-thali banner", (buf.length/1024|0)+"KB");

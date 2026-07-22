// Recreate every menu dish photo in a dark, aubergine/gold fine-dining style
// that matches the printed menu (deep burgundy stone, dark ceramic/copper,
// candlelight, shallow DoF). FLUX Pro v1.1 Ultra, 3:2, named by menu slot id so
// the design-doc refill is a straight swap. Output -> public/img/dishes-lux/.
//
// Proof run:  ONLY="se-papri,p-shahi-paneer,p-tandoori-chaap,p-gulab-jamun" node scripts/fal-dishes-lux.mjs
// Full run:   node scripts/fal-dishes-lux.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

function readFalKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  const line = readFileSync("/Users/inder/Claude/Projects/shared-keys/fal.env", "utf8")
    .split("\n").find((l) => /^\s*FAL_KEY\s*=/.test(l));
  return line && line.split("=").slice(1).join("=").trim().replace(/^"|"$/g, "");
}
const FAL_KEY = readFalKey();
const H = { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" };
const DIR = "public/img/dishes-lux";

// Premium menu look, tuned to the menu's aubergine + gold palette. Moody dark
// backdrop BUT the food is warmly spotlit so it glows against the dark menu
// cards; portions are generous and craveable (not precious fine-dining).
const STYLE =
  "Purely vegetarian. Premium restaurant menu food photography. The dish is generous and abundant, freshly served, and fills most of the frame. A warm, bright, flattering key light glows on the food so its rich colours, gloss and texture pop, set against a moody dark aubergine-and-burgundy background with soft golden candlelight — luminous food, dark surroundings (chiaroscuro). Served in dark ceramic or hammered copper on a deep burgundy surface. Appetising 45-degree hero angle, tight inviting framing, gentle rising steam where hot, fresh vibrant garnish, shallow depth of field, shot on a 50mm lens, true-to-life appetising colours, realistic food texture, subtle film grain. Looks delicious and craveable.";

const NEG =
  "sparse, tiny portion, half-empty plate, negative space, too dark, underexposed, dim, murky, muddy, dull, pretentious, dainty, oversaturated, neon, artificial, plastic, cgi, 3d render, cartoon, illustration, fake, glossy plastic, waxy, cluttered, messy, harsh flash, bright white background, blown highlights, text, watermark, logo, hands, fingers, deformed, chicken, meat, fish, egg, prawn";

// slot id -> concise, authentic subject description
const DISHES = {
  // Street Eats
  "se-golgappe": "gol gappe (pani puri) — a row of crisp hollow semolina puri spheres with a small copper pitcher of spiced green mint water, tamarind and a spoon of potato-chickpea filling",
  "se-paneertikka": "paneer tikka — char-grilled cubes of Indian paneer on a skewer with smoky charred edges and red tandoori marinade, grilled bell peppers and onion, a lime wedge and mint chutney",
  "se-papri": "papri chaat — crisp flat crackers layered with whipped yogurt, tamarind and mint chutneys, fine sev and jewel-like pomegranate",
  "se-dahibhalla": "dahi bhalla — soft lentil dumplings under chilled whipped yogurt, tamarind chutney, pomegranate and a dusting of sev and chaat masala",
  "se-dahipuri": "dahi puri — small crisp puris filled with yogurt, chickpeas, tamarind and mint chutneys and sev",
  "se-bhelpuri": "bhel puri — puffed rice tossed with fine sev, diced onion and tomato, chutneys and fresh coriander",
  "se-chillipaneer": "chilli paneer — cubes of paneer glazed in a glossy indo-chinese chilli sauce with peppers and spring onion",
  "se-chollebhature": "cholle bhature — a bowl of spiced chickpea curry beside a tall puffed golden fried bhatura bread, onion and pickle",
  "se-channasamosa": "samosa chaat — a broken samosa over spiced chickpea curry topped with yogurt, chutneys and sev",
  "se-cheesecutlets": "cheese cutlets — golden fried cheese croquettes with a small dish of chutney dip",
  "se-vadapav": "vada pav — a spiced potato fritter in a soft pav bun with green chutney and a fried chilli",
  "se-pavbhaji": "pav bhaji — a rich spiced mashed vegetable curry with a pat of butter, served with buttered toasted pav buns, chopped onion and lemon",
  "se-alootikki": "aloo tikki chaat — crisp golden potato patties topped with yogurt, tamarind and mint chutneys and sev",
  "se-masalafries": "masala fries — hand-cut fries tossed in red masala spice with coriander",
  "se-honeychilli": "honey chilli potatoes — crispy battered potatoes in a glossy sweet-heat honey chilli glaze with sesame seeds and spring onion",
  "se-samosa": "samosa — flaky golden triangular pastry with spiced potato and pea, two small chutneys",
  // Kathi Rolls
  "p-paneer-kathi-roll": "paneer kathi roll — a soft paratha wrap with spiced paneer, onion and chutney, cut on the diagonal to show the filling",
  "p-malai-chaap-roll": "malai chaap roll — a soft paratha wrap filled with creamy grilled soya chaap and onions",
  "p-cholle-kathi-roll": "cholle kathi roll — a soft paratha wrap filled with spiced chickpeas and onion",
  "p-aloo-kathi-roll": "aloo kathi roll — a soft paratha wrap filled with spiced potato and chutney",
  "p-veg-kabab-roll": "veg kabab roll — a soft paratha wrap filled with mixed vegetable kebab, onion and chutney",
  // Soya Chaap
  "p-malai-chaap": "malai soya chaap — creamy grilled soy skewers with a pale malai marinade and light char, coriander and a dusting of chaat masala",
  "p-butter-masala-chaap": "butter masala soya chaap — pieces of soya chaap folded through a silky orange-red tomato-butter masala with a cream swirl and coriander in a dark bowl",
  "p-tandoori-chaap": "tandoori soya chaap — smoky char-grilled soya chaap on skewers with blackened edges, sliced onion and lime",
  "p-kadhai-chaap": "kadhai soya chaap — soya chaap wok-tossed with bell peppers and onion in a thick spicy masala",
  "p-pudina-soya-chaap": "pudina soya chaap — grilled soya chaap in a fresh green mint marinade with coriander",
  "p-achari-soya-chaap": "achari soya chaap — grilled soya chaap glazed with tangy amber pickle spices",
  // Sandwiches & Burgers
  "p-paneer-sandwich": "grilled paneer sandwich — a tandoor-grilled paneer, vegetable and cheese sandwich with chutney, toasted and cut to show the layers",
  "p-veg-patty-sandwich": "veg patty sandwich — a grilled sandwich with a house vegetable patty, fresh vegetables and sauces, cut in half",
  "p-bombay-sandwich": "bombay sandwich — a grilled sandwich of potato, cheese and green chutney cut into triangles",
  "p-grilled-cheese": "grilled cheese sandwich — golden toasted bread with a melting cheese pull",
  "p-bombay-street-tikki-burger": "potato tikki burger — a crispy potato tikki patty burger with green chutney and fresh vegetables",
  "p-noodle-burger": "noodle burger — a burger stacked with crispy noodles, a vegetable patty and sauces",
  "p-veggie-fire-crunch-burger": "crunchy veg burger — a vegetable patty burger with crispy noodles and a spicy sauce",
  // Curries
  "p-navratan-korma": "navratan korma — a mild creamy korma of mixed vegetables, nuts and paneer with a saffron-cream sheen, garnished with slivered almonds",
  "p-paneer-bhurji": "paneer bhurji — crumbled spiced scrambled paneer with peppers, onion and coriander in a dark bowl",
  "p-shahi-paneer": "shahi paneer — soft paneer cubes in a rich royal cashew-tomato cream gravy with a cream swirl and coriander",
  "p-paneer-lababdar": "paneer lababdar — paneer in a velvety rich orange-red tomato gravy with a cream drizzle",
  "p-kadhai-paneer": "kadhai paneer — paneer with bell peppers and onion in a thick semi-dry spicy tomato masala",
  "p-paneer-jalfrezi": "paneer jalfrezi — sautéed paneer with julienned peppers and onions, dry style, glossy",
  "p-malai-kofta": "malai kofta — soft dumplings in a creamy saffron-tomato gravy with a cream swirl and nuts",
  "p-bharta": "baingan bharta — smoky mashed roasted eggplant with peas, tomato and coriander in a dark bowl",
  "p-daal-makhani": "daal makhani — glossy black lentils in a rich buttery tomato gravy with a swirl of cream and a pat of butter, coriander, in a hammered copper bowl",
  "p-palak-paneer": "palak paneer — paneer cubes in a creamy deep-green spinach gravy with a cream drizzle",
  "p-chana-palak": "chana palak — chickpeas simmered in a creamy spinach gravy",
  "p-aloo-gobi": "aloo gobi — home-style cauliflower and potato with turmeric, cumin and coriander, semi-dry",
  "p-okra-bhindi": "bhindi masala — sautéed okra with onion and spices, dry style",
  "p-matar-paneer": "matar paneer — green peas and paneer in a smooth tomato gravy",
  "p-rajma": "rajma — red kidney beans in a thick spiced tomato gravy with coriander in a rustic bowl",
  "p-cholle": "cholle (chana masala) — punjabi-style chickpeas in a dark spiced gravy with sliced onion, ginger and coriander",
  "p-daal-tadka": "daal tadka — yellow lentils topped with a sizzling ghee tempering of cumin, garlic and dried chilli, coriander",
  "p-daal-fry": "daal fry — comforting home-style yellow lentils with a spice tempering and coriander",
  "p-kadi": "kadhi pakora — a golden turmeric-yellow yogurt and gram-flour curry with soft pakora dumplings and a tempering",
  // Breakfast / Paranthas
  "p-amritsari-kulcha": "amritsari kulcha — a crisp stuffed kulcha bread with butter, served with chickpea curry, onions and pickle",
  "p-paneer-parantha": "paneer parantha — a stuffed flatbread with a pat of melting butter, yogurt and pickle, torn to show the paneer filling",
  "p-gobi-parantha": "gobi parantha — a cauliflower-stuffed flatbread with butter, yogurt and pickle",
  "p-pyaz-parantha": "pyaz parantha — an onion-stuffed flatbread with butter, yogurt and pickle",
  "p-aloo-parantha": "aloo parantha — a potato-stuffed flatbread with a pat of butter, yogurt and pickle",
  // Drinks
  "p-masala-chai": "masala chai — Indian spiced milk tea in a small glass cup with rising steam, cinnamon and cardamom beside it",
  "p-shahi-mango-shake": "shahi mango shake — a thick mango milkshake in a tall glass topped with chopped dry fruits and a saffron drizzle",
  "p-sweet-lassi": "sweet lassi — a creamy yogurt lassi in a traditional glass with a malai top and a dusting of cardamom",
  "p-salted-lassi": "salted lassi — a chilled savoury yogurt lassi in a glass with a hint of cumin and a mint leaf",
  "p-soda-lemonade": "masala soda lemonade — a sparkling lemon soda with black salt, cumin, mint and lemon slices over ice",
  "p-passion-fruit-lemonade": "passion fruit lemonade — a sparkling passion fruit lemonade over ice with mint",
  "p-shaadi-wali-coffee": "frothy whipped Indian coffee in a cup with a caramel-coloured foam top",
  "p-iced-coffee": "iced coffee in a tall glass with a swirl of cream and ice",
  "p-lemon-iced-tea": "lemon iced tea in a tall glass with lemon slices, mint and ice",
  // Desserts
  "p-rabri-with-jalebi": "rabri with jalebi — warm amber jalebi spirals beside thick saffron rabri cream scattered with pistachio",
  "p-rabri-falooda": "rabri falooda — a layered falooda sundae in a tall glass with vermicelli, rose syrup, rabri and slivered nuts",
  "p-rasmalai": "rasmalai — soft flattened paneer discs in saffron-cardamom milk garnished with pistachio slivers, in a bowl",
  "p-gulab-jamun": "gulab jamun — warm syrup-soaked golden-brown milk dumplings glistening in a bowl with a dried rose petal",
  "p-royal-gulab-jamun-rabri": "royal gulab jamun with rabri — gulab jamun crowned with thick saffron rabri and pistachio",
  "p-gajar-halwa": "gajar halwa — warm deep-orange carrot halwa with a ghee sheen, garnished with cashews and pistachio, in a bowl",
  "p-moong-daal-halwa": "moong daal halwa — a rich golden lentil halwa glistening with ghee and topped with slivered almonds",
};

async function gen(name, subject) {
  const prompt = `A realistic, appetising food photograph of ${subject}. ${STYLE}`;
  const res = await fetch("https://fal.run/fal-ai/flux-pro/v1.1-ultra", {
    method: "POST", headers: H,
    body: JSON.stringify({ prompt, aspect_ratio: "3:2", num_images: 1, output_format: "jpeg", negative_prompt: NEG }),
  });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status} ${await res.text()}`);
  const url = (await res.json()).images?.[0]?.url;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  mkdirSync(DIR, { recursive: true });
  writeFileSync(`${DIR}/${name}.jpg`, buf);
  console.log(`✓ ${name}.jpg`);
}

let names = Object.keys(DISHES);
if (process.env.ONLY) {
  const want = new Set(process.env.ONLY.split(",").map((s) => s.trim()));
  names = names.filter((n) => want.has(n));
}
console.log(`Generating ${names.length} dish photos → ${DIR}`);

// simple concurrency pool
const POOL = Number(process.env.POOL || 5);
let i = 0, ok = 0, fail = 0;
async function worker() {
  while (i < names.length) {
    const n = names[i++];
    try { await gen(n, DISHES[n]); ok++; }
    catch (e) { fail++; console.error("✗", n, String(e).slice(0, 200)); }
  }
}
await Promise.all(Array.from({ length: POOL }, worker));
console.log(`done. ok=${ok} fail=${fail}`);

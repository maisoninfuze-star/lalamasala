/*
  Brand content used across the marketing pages. In production these strings
  are editable via the admin CMS (content_sections table); here they seed the
  initial copy. Writing is deliberately sincere and restrained.
*/

export const BRAND = {
  name: "Lala Masala",
  tagline: {
    en: "Indian food, served from the heart.",
    fr: "La cuisine indienne, servie avec le cœur.",
  },
  heroSupporting: {
    en: "Vegetarian street food, curries and family recipes shaped by nearly five decades of culinary tradition.",
    fr: "Cuisine de rue végétarienne, currys et recettes de famille façonnés par près de cinquante ans de tradition culinaire.",
  },
  social: {
    instagram: "https://instagram.com/lalamasala43",
    facebook: "https://facebook.com/lalamasala",
    instagramHandle: "@lalamasala43",
  },
  ordering: {
    // Current online-ordering platform (per location).
    montreal: "https://www.clover.com/online-ordering/lala-masala-dollarddesormeaux",
  },
} as const;

// Kingston event hall — details sourced from the brand's own site.
export const EVENT_HALL_INFO = {
  capacity: "Up to 70 guests standing · 64 seated",
  events: [
    "Birthdays",
    "Engagements",
    "Small weddings",
    "Cultural & community events",
    "Corporate dinners",
    "Prayer & satsang gatherings",
  ],
  packages: [
    { name: "Hall Rental", price: "$90 / hour", note: "4-hour minimum. Outside food permitted (no on-site cooking)." },
    { name: "Hall + Catering", price: "$40 / person", note: "13 items · 25-guest minimum. Vegetarian catering by Lala Masala." },
    { name: "Budget Catering", price: "$25 / person", note: "7 items · 25-guest minimum." },
  ],
  addons: [
    "Additional curries, paneer & desserts",
    "Salads, appetizers & beverages",
    "Speakers & mic — $40",
    "Server service — $100",
    "Extended hours — $50 / hour",
  ],
  amenities: ["Tables & chairs", "Linens", "Water service", "Cutlery & napkins", "Setup assistance"],
};

export const STORY = {
  headline: { en: "A legacy cooked with love.", fr: "Un héritage cuisiné avec amour." },
  body: {
    en: [
      "Lala Masala was inspired by our family patriarch, Kundan Laal Chawla, whose kitchen was always open and whose table always had room for one more.",
      "Today, Chef Raghbir Singh Chawla carries that spirit forward, drawing on nearly fifty years of traditional cooking to bring the flavours of North India to Montreal, Kingston and Belleville.",
      "Everything is vegetarian, made from scratch, and served the way family food should be — generous, warm and without pretension.",
    ],
    fr: [
      "Lala Masala s'inspire de notre patriarche, Kundan Laal Chawla, dont la cuisine était toujours ouverte et la table toujours prête à accueillir une personne de plus.",
      "Aujourd'hui, le chef Raghbir Singh Chawla perpétue cet esprit, s'appuyant sur près de cinquante ans de cuisine traditionnelle pour apporter les saveurs du nord de l'Inde à Montréal, Kingston et Belleville.",
      "Tout est végétarien, préparé maison, et servi comme devrait l'être la cuisine familiale — généreuse, chaleureuse et sans prétention.",
    ],
  },
};

// Motto & Vision — the family philosophy (verbatim from the brand's own site).
export const MOTTO_VISION = {
  eyebrow: { en: "Motto & Vision", fr: "Devise et Vision" },
  headline: {
    en: "We cook and serve with love.",
    fr: "Nous cuisinons et servons avec amour.",
  },
  lead: {
    en: "Inspired by our beloved patriarch, Kundan Laal Chawla, we share the true essence of Indian cuisine.",
    fr: "Inspirés par notre patriarche bien-aimé, Kundan Laal Chawla, nous partageons la véritable essence de la cuisine indienne.",
  },
  body: {
    en: [
      "From rich curries with naan to the comforting taste of cholle bhature, every dish is crafted to transport you to the vibrant streets of India.",
      "We believe food is more than nourishment — it is a heartfelt exchange. With every meal, we strive to create a warm, welcoming experience that feels like family.",
    ],
    fr: [
      "Des currys riches accompagnés de naan au réconfort des cholle bhature, chaque plat est conçu pour vous transporter dans les rues animées de l'Inde.",
      "Nous croyons que la nourriture est bien plus qu'une simple subsistance — c'est un échange sincère. À chaque repas, nous cherchons à créer une expérience chaleureuse et accueillante, comme en famille.",
    ],
  },
};

export const CHEF = {
  name: "Chef Raghbir Singh Chawla",
  role: { en: "Chef & Custodian of the Recipes", fr: "Chef et gardien des recettes" },
  // Headline intro (verbatim from the brand's own site).
  intro: {
    en: "Chef Raghbir Singh Chawla carries forward a proud culinary legacy passed down from his father, Kundan Laal Chawla. With nearly fifty years of experience, he is known for his authentic flavours, traditional techniques and dedication to Indian cuisine. A mentor and a master of his craft, Chef Raghbir creates every dish with heart, skill and heritage.",
    fr: "Le chef Raghbir Singh Chawla perpétue un fier héritage culinaire transmis par son père, Kundan Laal Chawla. Fort de près de cinquante ans d'expérience, il est reconnu pour ses saveurs authentiques, ses techniques traditionnelles et son dévouement à la cuisine indienne. Mentor et maître de son art, le chef Raghbir crée chaque plat avec cœur, savoir-faire et héritage.",
  },
  body: {
    en: [
      "Chef Raghbir learned to cook at his father's side, memorising the ratios and rhythms of dishes that were never written down.",
      "His cooking honours those roots: freshly ground masalas, daals simmered overnight, breads pulled straight from the tandoor.",
      "For Chef Raghbir, hospitality is not a service — it is who the Chawla family has always been.",
    ],
    fr: [
      "Le chef Raghbir a appris à cuisiner aux côtés de son père, mémorisant les proportions et les rythmes de plats qui n'ont jamais été écrits.",
      "Sa cuisine honore ces racines : masalas fraîchement moulus, daals mijotés toute la nuit, pains sortis directement du tandoor.",
      "Pour le chef Raghbir, l'hospitalité n'est pas un service — c'est ce que la famille Chawla a toujours été.",
    ],
  },
};

export const CATERING = {
  headline: { en: "Catering for every gathering", fr: "Traiteur pour chaque rassemblement" },
  body: {
    en: "From office lunches to weddings and community celebrations, we cater vegetarian menus at any scale — thalis, live chaat, curries and fresh tandoor breads.",
    fr: "Des dîners de bureau aux mariages et célébrations communautaires, nous offrons des menus végétariens à toute échelle — thalis, chaat en direct, currys et pains frais du tandoor.",
  },
};

export const EVENT_HALL = {
  headline: { en: "Lala Event Hall — Kingston", fr: "Lala Event Hall — Kingston" },
  body: {
    en: "A warm, elegant space in Kingston for birthdays, engagements and community events, with in-house catering from the Lala Masala kitchen.",
    fr: "Un espace chaleureux et élégant à Kingston pour anniversaires, fiançailles et événements communautaires, avec service traiteur de la cuisine Lala Masala.",
  },
};

export const NAV = [
  { href: "/menu", label: { en: "Menu", fr: "Menu" } },
  { href: "/our-story", label: { en: "About Us", fr: "À Propos" } },
  { href: "/locations", label: { en: "Locations", fr: "Emplacements" } },
  { href: "/catering", label: { en: "Catering", fr: "Traiteur" } },
  { href: "/event-hall", label: { en: "Event Hall", fr: "Salle d'Événements" } },
  { href: "/contact", label: { en: "Contact", fr: "Contact" } },
] as const;

// Key links shown inline in the desktop top bar (the rest live in the overlay).
export const PRIMARY_NAV = [
  { href: "/menu", label: { en: "Menu", fr: "Menu" } },
  { href: "/our-story", label: { en: "About Us", fr: "À Propos" } },
  { href: "/locations", label: { en: "Locations", fr: "Emplacements" } },
  { href: "/contact", label: { en: "Contact", fr: "Contact" } },
] as const;

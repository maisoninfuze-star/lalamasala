import type {
  CategorySeed,
  DishSeed,
  ModifierGroupSeed,
} from "@/lib/types";

/*
  Menu source of truth — prices, names and bilingual (FR/EN) descriptions are
  taken verbatim from the real Lala Masala Montreal menu (lalamasala.com).
  Photos are the brand's own dish images, downloaded to /public/img/dishes.
  Every price (integer cents, CAD) remains editable per-location in admin.
*/

const CAT_IMG = "/img/categories";
const BRAND_IMG = "/img/brand";
const DISH_IMG = "/img/dishes";

export const CATEGORIES: CategorySeed[] = [
  {
    slug: "build-your-thali",
    name: { en: "Build Your Thali", fr: "Créez Votre Thali" },
    description: {
      en: "Seven delights on one royal platter — bread, grains, three curries, a side and a sweet dessert.",
      fr: "Sept délices sur un plateau royal — pain, céréales, trois currys, un accompagnement et un dessert.",
    },
    image: `${BRAND_IMG}/hero-main.jpg`,
  },
  {
    slug: "curry-grain-bowls",
    name: { en: "Curry Grain Bowls", fr: "Bols de Grains au Curry" },
    description: {
      en: "Build your perfect curry bowl — rice or quinoa with your favourite curry and a fresh side salad.",
      fr: "Composez votre bol de curry — riz ou quinoa avec votre curry préféré et une salade fraîche.",
    },
    image: `${BRAND_IMG}/hero-2.jpg`,
  },
  {
    slug: "taste-of-the-streets",
    name: { en: "Taste of the Streets", fr: "Le Goût de la Rue" },
    description: {
      en: "Chaat, tikki and fried favourites from the lanes of North India.",
      fr: "Chaat, tikki et fritures emblématiques des ruelles du nord de l'Inde.",
    },
    image: `${CAT_IMG}/taste-of-the-streets.jpeg`,
  },
  {
    slug: "kathi-rolls",
    name: { en: "Kathi Rolls", fr: "Rouleaux Kathi" },
    description: {
      en: "Flame-cooked fillings wrapped in soft, flaky paratha.",
      fr: "Garnitures grillées à la flamme, enroulées dans un paratha feuilleté.",
    },
    image: `${CAT_IMG}/kathi-rolls.jpeg`,
  },
  {
    slug: "sandwiches-burgers",
    name: { en: "Sandwiches & Burgers", fr: "Sandwichs & Burgers" },
    description: {
      en: "Griddled, spiced and stacked — a masala take on comfort classics.",
      fr: "Grillés, épicés et généreux — une touche masala sur les classiques réconfortants.",
    },
    image: `${CAT_IMG}/sandwiches-burgers.jpeg`,
  },
  {
    slug: "soya-chaap",
    name: { en: "Chaap (Soya Chops)", fr: "Chaap de Soya" },
    description: {
      en: "Tender marinated soy chaap, grilled for a smoky taste and juicy texture.",
      fr: "Soya chaap tendre et mariné, grillé pour un goût fumé et une texture juteuse.",
    },
    image: `${CAT_IMG}/soya-chaap.jpeg`,
  },
  {
    slug: "curries",
    name: { en: "Curries", fr: "Currys" },
    description: {
      en: "Slow-simmered daals, paneer and vegetables — served with basmati rice or bread.",
      fr: "Daals, paneer et légumes mijotés lentement — servis avec riz basmati ou pain.",
    },
    image: `${DISH_IMG}/paneer-butter-masala.png`,
  },
  {
    slug: "roti-naan",
    name: { en: "Roti & Naan", fr: "Le Naan & un Rôti" },
    description: {
      en: "Fresh tandoor breads, brushed with butter and garlic.",
      fr: "Pains frais du tandoor, badigeonnés de beurre et d'ail.",
    },
    image: `${DISH_IMG}/garlic-naan.png`,
  },
  {
    slug: "breakfast-paranthas",
    name: { en: "Breakfast & Paranthas", fr: "Le Petit-Déjeuner & Paratha" },
    description: {
      en: "Stuffed griddle breads served with yogurt, butter and pickle.",
      fr: "Pains farcis servis avec yogourt, beurre et achard.",
    },
    image: `${DISH_IMG}/aloo-parantha.png`,
  },
  {
    slug: "drinks",
    name: { en: "Drinks", fr: "Les Boissons" },
    description: {
      en: "Lassis, masala chai and coolers to balance the spice.",
      fr: "Lassis, chai masala et rafraîchissements pour équilibrer les épices.",
    },
    image: `${DISH_IMG}/shahi-mango-shake.png`,
  },
  {
    slug: "desserts",
    name: { en: "Desserts", fr: "Le Dessert" },
    description: {
      en: "Warm, milky and honeyed — the sweet close to every meal.",
      fr: "Chauds, lactés et mielleux — la douce fin de chaque repas.",
    },
    image: `${DISH_IMG}/gulab-jamun.png`,
  },
];

// Factory applying sensible dietary defaults, and auto-wiring the dish photo.
function dish(
  d: Partial<DishSeed> &
    Pick<DishSeed, "slug" | "categorySlug" | "name" | "basePriceCents">,
): DishSeed {
  return {
    description: { en: "", fr: "" },
    spice: "none",
    isPopular: false,
    isFeatured: false,
    isVegan: false,
    canBeVegan: false,
    isGlutenFriendly: false,
    containsDairy: false,
    containsNuts: false,
    image: `${DISH_IMG}/${d.slug}.png`,
    ...d,
  };
}

export const DISHES: DishSeed[] = [
  // --- Build Your Thali -----------------------------------------------------
  dish({
    slug: "build-your-thali",
    categorySlug: "build-your-thali",
    name: { en: "Build Your Thali", fr: "Créez Votre Thali" },
    description: {
      en: "Seven delights on one royal platter — bread, grains, three curries, a side, yogurt or salad, and a sweet dessert.",
      fr: "Sept délices sur un plateau royal — pain, céréales, trois currys, un accompagnement, yogourt ou salade, et un dessert.",
    },
    basePriceCents: 1500,
    image: `${BRAND_IMG}/hero-main.jpg`,
    isFeatured: true,
    isPopular: true,
    canBeVegan: true,
    containsDairy: true,
    modifierGroupSlugs: ["thali-bread", "thali-grain", "thali-curries", "thali-side", "thali-dessert"],
  }),

  // --- Curry Grain Bowls (build-your-own) -----------------------------------
  dish({
    slug: "curry-grain-bowl",
    categorySlug: "curry-grain-bowls",
    name: { en: "Curry Grain Bowl", fr: "Bol de Grains au Curry" },
    description: {
      en: "Choose rice or quinoa with your favourite curry, and enjoy with a fresh side salad.",
      fr: "Choisissez riz ou quinoa avec votre curry préféré, et savourez avec une salade fraîche.",
    },
    basePriceCents: 1600,
    image: `${BRAND_IMG}/hero-2.jpg`,
    isFeatured: true,
    canBeVegan: true,
    containsDairy: true,
    isGlutenFriendly: true,
    modifierGroupSlugs: ["bowl-grain", "bowl-curry", "spice-level"],
  }),

  // --- Taste of the Streets -------------------------------------------------
  dish({ slug: "dahi-puri", categorySlug: "taste-of-the-streets", name: { en: "Dahi Puri", fr: "Dahi Puri" }, description: { en: "Round puri stuffed with spiced potatoes, chickpeas, yogurt, chutneys, sev, moong dal, pomegranate and coriander.", fr: "Puri croustillant garni de pommes de terre épicées, pois chiches, yaourt et chutneys de tamarin et de menthe." }, basePriceCents: 1000, isPopular: true, containsDairy: true, spice: "mild" }),
  dish({ slug: "bhel-puri", categorySlug: "taste-of-the-streets", name: { en: "Bhel Puri", fr: "Bhel Puri" }, description: { en: "Puffed rice and crispy sev mixed with potatoes, onions, tomatoes, chaat masala and chutney.", fr: "Riz soufflé et sev mélangés à des pommes de terre, oignons, tomates, chaat masala et chutneys." }, basePriceCents: 900, isVegan: true, spice: "mild" }),
  dish({ slug: "papri-chaat", categorySlug: "taste-of-the-streets", name: { en: "Papri Chaat", fr: "Papri Chaat" }, description: { en: "Crisp wafers topped with chickpeas, potatoes, yogurt, tamarind and coriander chutneys, and pomegranate seeds.", fr: "Galettes croustillantes garnies de pois chiches, pommes de terre, sauce au yaourt, chutneys et graines de grenade." }, basePriceCents: 1000, containsDairy: true, spice: "mild" }),
  dish({ slug: "dahi-bhalle", categorySlug: "taste-of-the-streets", name: { en: "Dahi Bhalle", fr: "Dahi Bhalle" }, description: { en: "Lentil dumplings dipped in yogurt and topped with sweet and spicy chutneys.", fr: "Beignets de lentilles trempés dans du yaourt, nappés de chutneys doux et épicés." }, basePriceCents: 1000, containsDairy: true }),
  dish({ slug: "samosa", categorySlug: "taste-of-the-streets", name: { en: "Samosa", fr: "Samoussa" }, description: { en: "Crispy golden pastry stuffed with spiced potatoes and peas, served hot with mint or tamarind chutney.", fr: "Feuilleté croustillant et doré, farci de pommes de terre épicées et petits pois, servi avec chutney." }, basePriceCents: 249, isVegan: true, isPopular: true, spice: "mild" }),
  dish({ slug: "masala-fries", categorySlug: "taste-of-the-streets", name: { en: "Masala Fries", fr: "Frites au Masala" }, description: { en: "Crispy fries tossed in aromatic Indian spices for a flavorful twist on a classic favorite.", fr: "Frites croustillantes mélangées à des épices indiennes aromatiques." }, basePriceCents: 800, isVegan: true, spice: "medium" }),
  dish({ slug: "paneer-tikka", categorySlug: "taste-of-the-streets", name: { en: "Paneer Tikka", fr: "Paneer Tikka" }, description: { en: "Marinated paneer cubes grilled in a traditional tandoor, served with sautéed onions and bell peppers.", fr: "Cubes de fromage indien marinés, grillés au tandoor, servis avec oignons et poivrons sautés." }, basePriceCents: 1600, isPopular: true, isFeatured: true, containsDairy: true, isGlutenFriendly: true, spice: "medium" }),
  dish({ slug: "honey-chilli-fries", categorySlug: "taste-of-the-streets", name: { en: "Honey Chilli Fries", fr: "Frites au Miel et au Piment" }, description: { en: "Crispy fries tossed in sweet-spicy honey chilli sauce, stir-fried with garlic, onions and bell peppers.", fr: "Frites dorées enrobées d'une sauce miel-piment, sautées à l'ail avec oignons et poivrons." }, basePriceCents: 1000, spice: "hot" }),
  dish({ slug: "pakora", categorySlug: "taste-of-the-streets", name: { en: "Pakora", fr: "Pakora" }, description: { en: "Crispy chickpea-flour fritters filled with spiced vegetables, fried golden and served hot.", fr: "Beignets croustillants à base de farine de pois chiches, épicés et frits à la perfection." }, basePriceCents: 1200, isVegan: true, spice: "medium", modifierGroupSlugs: ["pakora-type"] }),
  dish({ slug: "aloo-tikki-chaat", categorySlug: "taste-of-the-streets", name: { en: "Aloo Tikki Chaat", fr: "Aloo Tikki Chaat" }, description: { en: "A crispy potato patty with spices, onions and coriander, topped with yogurt and chutneys.", fr: "Galette de pommes de terre croustillante, garnie de yaourt et de chutneys." }, basePriceCents: 800, containsDairy: true, spice: "medium", modifierGroupSlugs: ["add-cholle"] }),
  dish({ slug: "cheese-cutlets", categorySlug: "taste-of-the-streets", name: { en: "Cheese Cutlets (4 pcs)", fr: "Croquettes au Fromage" }, description: { en: "Golden-brown cutlets filled with creamy cheese and aromatic spices, served hot.", fr: "Croquettes dorées garnies de fromage fondant et d'épices." }, basePriceCents: 800, containsDairy: true, spice: "mild" }),
  dish({ slug: "chilli-paneer", categorySlug: "taste-of-the-streets", name: { en: "Chilli Paneer", fr: "Chilli Paneer" }, description: { en: "Tender paneer cubes tossed with bell peppers, onions and green chilies in a spicy Indo-Chinese sauce.", fr: "Cubes de paneer sautés avec poivrons, oignons et piments verts dans une sauce indo-chinoise." }, basePriceCents: 1500, isPopular: true, containsDairy: true, spice: "hot" }),
  dish({ slug: "gol-gappe", categorySlug: "taste-of-the-streets", name: { en: "Gol Gappe", fr: "Gol Gappe" }, description: { en: "Crispy hollow puris filled with spiced potatoes, chickpeas, onions, tamarind chutney and spiced water.", fr: "Boulettes frites croustillantes, remplies de pommes de terre épicées, pois chiches et eau épicée." }, basePriceCents: 800, isVegan: true, spice: "medium" }),
  dish({ slug: "vada-pav", categorySlug: "taste-of-the-streets", name: { en: "Vada Pav", fr: "Vada Pav" }, description: { en: "Deep-fried potato dumpling placed inside a bread bun, with chutneys and a green chili pepper.", fr: "Boulette de pommes de terre frite dans un pain, servie avec chutneys et piment vert." }, basePriceCents: 800, isVegan: true, spice: "medium" }),
  dish({ slug: "pav-bhaji", categorySlug: "taste-of-the-streets", name: { en: "Pav Bhaji", fr: "Pav Bhaji" }, description: { en: "Mashed spiced vegetable curry topped with butter, onion, coriander and lime, served with warm buttered rolls.", fr: "Curry épais de légumes épicés, garni de beurre, oignons et coriandre, servi avec petits pains beurrés." }, basePriceCents: 1200, isPopular: true, containsDairy: true, spice: "medium" }),
  dish({ slug: "cholle-bhature", categorySlug: "taste-of-the-streets", name: { en: "Cholle Bhature", fr: "Cholle Bhature" }, description: { en: "Chickpea curry served with fried bread, onions, pickled carrots, green chutney and achaar.", fr: "Curry de pois chiches servi avec pain frit, oignons, carottes marinées, chutney vert et achaar." }, basePriceCents: 1000, isPopular: true, spice: "medium" }),
  dish({ slug: "channa-samosa", categorySlug: "taste-of-the-streets", name: { en: "Channa Samosa", fr: "Channa Samosa" }, description: { en: "Deep-fried savory pastries filled with potatoes and peas, served with tamarind and mint chutneys.", fr: "Pâtisseries salées frites, farcies de pommes de terre et petits pois, servies avec chutneys." }, basePriceCents: 1200, spice: "medium" }),
  dish({ slug: "momos", categorySlug: "taste-of-the-streets", name: { en: "Momos (8 pcs)", fr: "Momos" }, description: { en: "Delicate vegetable dumplings, steamed or fried, served with a zesty dipping sauce.", fr: "Délicats dumplings aux légumes, cuits à la vapeur ou frits, servis avec une sauce piquante." }, basePriceCents: 1200, isPopular: true, spice: "medium", modifierGroupSlugs: ["momo-filling", "momo-prep"] }),

  // --- Kathi Rolls ----------------------------------------------------------
  dish({ slug: "paneer-kathi-roll", categorySlug: "kathi-rolls", name: { en: "Paneer Kathi Roll", fr: "Rouleau au Paneer" }, description: { en: "Soft paratha wrapped with spiced paneer, crunchy onions, cabbage, tangy chutney and fresh cilantro.", fr: "Cubes de paneer épicés enroulés dans un paratha moelleux avec oignons, chou, chutney et coriandre." }, basePriceCents: 1100, isPopular: true, isFeatured: true, containsDairy: true, spice: "medium", modifierGroupSlugs: ["spice-level", "roll-extras"] }),
  dish({ slug: "cholle-kathi-roll", categorySlug: "kathi-rolls", name: { en: "Cholle Kathi Roll", fr: "Rouleau aux Pois Chiches" }, description: { en: "Spiced chickpeas wrapped in a warm paratha.", fr: "Pois chiches épicés enroulés dans un paratha chaud." }, basePriceCents: 900, isVegan: true, spice: "medium", modifierGroupSlugs: ["spice-level", "roll-extras"] }),
  dish({ slug: "malai-chaap-roll", categorySlug: "kathi-rolls", name: { en: "Malai Chaap Roll", fr: "Rouleau de Chaap Crémeux" }, description: { en: "Marinated soy chaap grilled and wrapped in soft paratha with malai sauce, onions and cilantro.", fr: "Soy chaap mariné, grillé et enroulé dans un paratha moelleux, avec sauce malai, oignons et coriandre." }, basePriceCents: 1200, containsDairy: true, spice: "mild", modifierGroupSlugs: ["spice-level", "roll-extras"] }),
  dish({ slug: "aloo-kathi-roll", categorySlug: "kathi-rolls", name: { en: "Aloo Kathi Roll", fr: "Rouleau à la Pomme de Terre" }, description: { en: "Soft paratha wrapped with seasoned potatoes, onions, cabbage, tangy chutney and fresh cilantro.", fr: "Paratha moelleux garni de pommes de terre assaisonnées, oignons, chou, chutney et coriandre." }, basePriceCents: 900, isVegan: true, spice: "medium", modifierGroupSlugs: ["spice-level", "roll-extras"] }),
  dish({ slug: "veg-kabab-roll", categorySlug: "kathi-rolls", name: { en: "Veg Kabab Roll", fr: "Rouleau de Kebab Végétarien" }, description: { en: "Succulent vegetable kababs, grilled to perfection and wrapped in a soft paratha.", fr: "Kababs de légumes juteux, grillés et enroulés dans un paratha moelleux." }, basePriceCents: 1000, spice: "medium", modifierGroupSlugs: ["spice-level", "roll-extras"] }),

  // --- Sandwiches & Burgers -------------------------------------------------
  dish({ slug: "aloo-tikki-sandwich", categorySlug: "sandwiches-burgers", name: { en: "Aloo Tikki Sandwich", fr: "Sandwich Aloo Tikki" }, description: { en: "Golden potato patties in soft bread, topped with tangy chutneys, crunchy onions and fresh cilantro.", fr: "Galettes de pommes de terre dorées, dans du pain moelleux, avec chutneys, oignons et coriandre." }, basePriceCents: 1200, spice: "medium" }),
  dish({ slug: "bombay-sandwich", categorySlug: "sandwiches-burgers", name: { en: "Bombay Sandwich", fr: "Sandwich Bombay" }, description: { en: "Tangy chutney, crunchy vegetables and potato slices, grilled between soft bread for crunch.", fr: "Légumes croquants, pommes de terre et chutney acidulé, dans du pain moelleux grillé." }, basePriceCents: 900, isPopular: true, containsDairy: true, spice: "medium" }),
  dish({ slug: "noodle-burger", categorySlug: "sandwiches-burgers", name: { en: "Noodle Burger", fr: "Burger aux Nouilles" }, description: { en: "Hakka-Chinese noodles and veggie patty, seasoned and stacked between burger buns with fresh veggies and savory sauces.", fr: "Nouilles Hakka et galette de légumes, entre pains à burger avec légumes frais et sauces." }, basePriceCents: 900, spice: "medium" }),
  dish({ slug: "paneer-sandwich", categorySlug: "sandwiches-burgers", name: { en: "Paneer Sandwich", fr: "Sandwich au Paneer" }, description: { en: "Spiced paneer cubes between fresh bread, grilled crispy, served with tangy chutney.", fr: "Cubes de paneer épicés entre pain frais, grillés croustillants, servis avec chutney." }, basePriceCents: 1200, containsDairy: true, spice: "medium" }),
  dish({ slug: "grilled-cheese", categorySlug: "sandwiches-burgers", name: { en: "Grilled Cheese", fr: "Fromage Grillé" }, description: { en: "Gooey melted cheese sandwiched between crispy, buttery bread slices. Simple and satisfying.", fr: "Fromage fondant entre tranches de pain beurré et croustillant. Simple et délicieux." }, basePriceCents: 800, containsDairy: true }),
  dish({ slug: "veggie-fire-crunch-burger", categorySlug: "sandwiches-burgers", name: { en: "Veggie Fire Crunch Burger", fr: "Burger Végétarien Croustillant au Feu" }, description: { en: "Crispy mixed-veg patty with lettuce, tomato, onion and spicy vegan sriracha mayo, bold and crunchy.", fr: "Galette croustillante de légumes avec laitue, tomate, oignon et mayo sriracha vegan." }, basePriceCents: 1100, spice: "hot" }),
  dish({ slug: "bombay-street-tikki-burger", categorySlug: "sandwiches-burgers", name: { en: "Bombay Street Tikki Burger", fr: "Burger Tikki de Rue Bombay" }, description: { en: "Classic aloo tikki burger with lettuce, tomato, onion, tangy ketchup and green chutney — crispy and flavorful.", fr: "Burger aloo tikki classique avec laitue, tomate, oignon, ketchup et chutney vert." }, basePriceCents: 800, spice: "medium" }),

  // --- Soya Chaap -----------------------------------------------------------
  dish({ slug: "malai-chaap", categorySlug: "soya-chaap", name: { en: "Malai Chaap", fr: "Chaap Crémeuse" }, description: { en: "Tender soy chaap marinated in a creamy blend of spices and grilled, covered with cheese, cream and nuts.", fr: "Soy chaap tendre mariné dans un mélange crémeux d'épices, grillé et nappé de fromage, crème et noix." }, basePriceCents: 1400, isPopular: true, isFeatured: true, containsDairy: true, containsNuts: true, spice: "mild" }),
  dish({ slug: "tandoori-chaap", categorySlug: "soya-chaap", name: { en: "Tandoori Chaap (8 pcs)", fr: "Chaap Tandoori" }, description: { en: "Tender soy chaap marinated in yogurt, spices and herbs, grilled in a traditional tandoor for smoky, rich flavour.", fr: "Soy chaap tendre mariné dans du yaourt, épices et herbes, grillé au tandoor pour des saveurs fumées." }, basePriceCents: 1200, containsDairy: true, spice: "hot" }),
  dish({ slug: "pudina-soya-chaap", categorySlug: "soya-chaap", name: { en: "Pudina Soya Chaap", fr: "Chaap à la Menthe" }, description: { en: "Tender soya chaap marinated in fresh mint, herbs and mild spices, grilled for a refreshing, flavourful bite.", fr: "Soy chaap tendre mariné dans de la menthe fraîche, des herbes et des épices douces, grillé." }, basePriceCents: 1500, spice: "medium" }),
  dish({ slug: "kadhai-chaap", categorySlug: "soya-chaap", name: { en: "Kadhai Chaap", fr: "Chaap au Kadhai" }, description: { en: "Tender soy chaap cooked in a traditional kadhai with aromatic spices, bell peppers, onions and tomatoes.", fr: "Soy chaap tendre cuisiné dans un kadhai avec épices aromatiques, poivrons, oignons et tomates." }, basePriceCents: 1700, spice: "hot" }),
  dish({ slug: "butter-masala-chaap", categorySlug: "soya-chaap", name: { en: "Spl. Butter Masala Chaap", fr: "Chaap au Beurre Masala" }, description: { en: "Tender soy chaap cooked in a luscious tomato-based gravy, enriched with butter and aromatic spices.", fr: "Soy chaap tendre cuit dans une sauce crémeuse à base de tomates, beurre et épices aromatiques." }, basePriceCents: 1800, isPopular: true, containsDairy: true, spice: "mild" }),
  dish({ slug: "achari-soya-chaap", categorySlug: "soya-chaap", name: { en: "Achari Soya Chaap", fr: "Chaap aux Épices Achari" }, description: { en: "Juicy soya chaap infused with tangy achari spices and slow-grilled for bold, zesty North Indian flavours.", fr: "Soy chaap juteux parfumé aux épices achari, grillé lentement pour des saveurs audacieuses." }, basePriceCents: 1400, spice: "hot" }),

  // --- Curries --------------------------------------------------------------
  dish({ slug: "daal-makhani", categorySlug: "curries", name: { en: "Daal Makhani", fr: "Crème de Lentilles Noires" }, description: { en: "Black lentils and kidney beans simmered in creamy tomato sauce with spices, butter and cream.", fr: "Lentilles noires et haricots rouges mijotés dans sauce crémeuse aux tomates, beurre et épices." }, basePriceCents: 1600, isPopular: true, isFeatured: true, containsDairy: true, isGlutenFriendly: true, spice: "mild", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "cholle", categorySlug: "curries", name: { en: "Cholle", fr: "Pois Chiches Épicés" }, description: { en: "Hearty chickpeas cooked in a flavorful blend of spices and tangy tomato sauce.", fr: "Pois chiches mijotés dans un mélange d'épices savoureuses et une sauce tomate acidulée." }, basePriceCents: 1400, isVegan: true, isGlutenFriendly: true, spice: "medium", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "rajma", categorySlug: "curries", name: { en: "Rajma", fr: "Haricots Rouges Épicés" }, description: { en: "Tender kidney beans cooked in a flavorful tomato-based gravy with aromatic spices.", fr: "Haricots rouges tendres cuits dans une sauce tomate savoureuse aux épices aromatiques." }, basePriceCents: 1400, isVegan: true, isGlutenFriendly: true, spice: "medium", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "kadhai-paneer", categorySlug: "curries", name: { en: "Kadhai Paneer", fr: "Kadhahi Paneer" }, description: { en: "Paneer cubes cooked with bell peppers, onions, tomatoes and spices in a kadhai.", fr: "Cubes de paneer cuits avec poivrons, oignons, tomates et épices dans un kadhai." }, basePriceCents: 1700, isPopular: true, containsDairy: true, isGlutenFriendly: true, spice: "hot", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "aloo-gobi", categorySlug: "curries", name: { en: "Aloo Gobi", fr: "Chou-fleur aux Pommes de Terre" }, description: { en: "Classic vegetarian dish of potatoes and cauliflower cooked with turmeric, cumin and coriander.", fr: "Plat végétarien classique de pommes de terre et chou-fleur aux épices aromatiques." }, basePriceCents: 1600, isVegan: true, isGlutenFriendly: true, spice: "medium", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "daal-tadka", categorySlug: "curries", name: { en: "Daal Tadka", fr: "Lentilles aux Épices" }, description: { en: "Lentils cooked and tempered with cumin, mustard seeds, garlic and dried red chilies.", fr: "Lentilles assaisonnées de cumin, graines de moutarde, ail et piments rouges." }, basePriceCents: 1400, isVegan: true, isGlutenFriendly: true, spice: "mild", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "methi-matar-malai", categorySlug: "curries", name: { en: "Methi Matar Malai", fr: "Petits Pois Crémeux" }, description: { en: "Creamy fenugreek and green peas cooked with spices and herbs for a rich, flavorful dish.", fr: "Plat crémeux de fenugrec et pois verts aux épices aromatiques." }, basePriceCents: 1600, containsDairy: true, isGlutenFriendly: true, spice: "mild", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "paneer-lababdar", categorySlug: "curries", name: { en: "Paneer Lababdar", fr: "Paneer Crémeux Épicé" }, description: { en: "Tender paneer cubes in creamy tomato gravy with butter, cream and aromatic spices.", fr: "Cubes de paneer tendres dans une sauce crémeuse à base de tomates, beurre et épices." }, basePriceCents: 1700, containsDairy: true, isGlutenFriendly: true, spice: "mild", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "paneer-bhurji", categorySlug: "curries", name: { en: "Paneer Bhurji", fr: "Paneer Émietté Épicé" }, description: { en: "A delightful scramble of crumbled paneer cooked with onions, tomatoes and aromatic spices.", fr: "Paneer émietté sauté avec oignons, tomates et épices aromatiques." }, basePriceCents: 2200, containsDairy: true, isGlutenFriendly: true, spice: "medium", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "paneer-butter-masala", categorySlug: "curries", name: { en: "Paneer Butter Masala", fr: "Fromage au Beurre Épicé" }, description: { en: "Tender paneer cubes in rich, creamy tomato gravy with butter, cream and aromatic spices.", fr: "Cubes de paneer tendres dans une sauce crémeuse à base de tomates, beurre, crème et épices." }, basePriceCents: 1700, isPopular: true, isFeatured: true, containsDairy: true, isGlutenFriendly: true, spice: "mild", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "palak-paneer", categorySlug: "curries", name: { en: "Palak Paneer", fr: "Fromage aux Épinards" }, description: { en: "Tender paneer cubes simmered in a vibrant blend of spinach and aromatic spices.", fr: "Cubes de paneer tendres mijotés dans un mélange d'épinards et épices aromatiques." }, basePriceCents: 1600, isPopular: true, containsDairy: true, isGlutenFriendly: true, spice: "mild", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "malai-kofta", categorySlug: "curries", name: { en: "Malai Kofta", fr: "Croquettes Crémeuses" }, description: { en: "Paneer balls simmered in a rich, luscious tomato-based gravy infused with cream and aromatic spices.", fr: "Boulettes de paneer mijotées dans une sauce crémeuse à base de tomates et épices." }, basePriceCents: 1700, containsDairy: true, containsNuts: true, isGlutenFriendly: true, spice: "mild", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "kadi", categorySlug: "curries", name: { en: "Kadi", fr: "Curry au Yaourt" }, description: { en: "A tangy, creamy yogurt-based curry tempered with fenugreek seeds, curry leaves and mustard seeds.", fr: "Curry crémeux et acidulé à base de yaourt, relevé de graines de fenugrec et feuilles de curry." }, basePriceCents: 1400, containsDairy: true, spice: "mild", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "okra", categorySlug: "curries", name: { en: "Okra (Bhindi)", fr: "Gombo Sauté Épicé" }, description: { en: "Tender okra pods cooked with onions, tomatoes and aromatic spices, flavorful and slightly crispy.", fr: "Gombos tendres cuits avec oignons, tomates et épices aromatiques." }, basePriceCents: 1600, isVegan: true, isGlutenFriendly: true, spice: "medium", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "bharta", categorySlug: "curries", name: { en: "Baingan Bharta", fr: "Aubergine Rôtie Épicée" }, description: { en: "Smoky, roasted and mashed eggplant cooked and seasoned with aromatic spices and herbs.", fr: "Aubergine rôtie et écrasée, cuite avec épices et herbes aromatiques pour un goût fumé." }, basePriceCents: 1700, isVegan: true, isGlutenFriendly: true, spice: "medium", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "daal-fry", categorySlug: "curries", name: { en: "Daal Fry", fr: "Lentilles Épicées" }, description: { en: "Lentils cooked with onions, tomatoes, garlic and spices, tempered for a comforting, flavorful dish.", fr: "Lentilles assaisonnées avec oignons, tomates, ail et épices." }, basePriceCents: 1400, isVegan: true, isGlutenFriendly: true, spice: "mild", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "matar-paneer", categorySlug: "curries", name: { en: "Matar Paneer", fr: "Fromage aux Petits Pois" }, description: { en: "Paneer and green peas cooked in creamy tomato gravy with cumin, coriander and garam masala.", fr: "Paneer et pois verts dans sauce crémeuse aux tomates, cumin, coriandre et garam masala." }, basePriceCents: 1500, containsDairy: true, isGlutenFriendly: true, spice: "medium", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "chana-palak", categorySlug: "curries", name: { en: "Chana Palak", fr: "Épinards aux Pois Chiches" }, description: { en: "Tender chickpeas cooked with spinach and aromatic spices — nutritious, flavorful and protein-packed.", fr: "Pois chiches tendres cuits avec épinards et épices aromatiques." }, basePriceCents: 1600, isVegan: true, isGlutenFriendly: true, spice: "medium", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "shahi-paneer", categorySlug: "curries", name: { en: "Shahi Paneer", fr: "Fromage Royal Crémeux" }, description: { en: "Paneer cubes in rich, creamy cashew gravy with aromatic spices — a royal, indulgent dish.", fr: "Cubes de paneer dans une sauce crémeuse aux noix de cajou et épices, riche et savoureux." }, basePriceCents: 1700, containsDairy: true, containsNuts: true, isGlutenFriendly: true, spice: "mild", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "paneer-jalfrezi", categorySlug: "curries", name: { en: "Paneer Jalfrezi", fr: "Fromage Sauté Épicé" }, description: { en: "Spicy paneer stir-fried with bell peppers, onions, tomatoes and aromatic spices — bold and flavorful.", fr: "Cubes de paneer sautés avec poivrons, oignons, tomates et épices aromatiques." }, basePriceCents: 1700, containsDairy: true, isGlutenFriendly: true, spice: "hot", modifierGroupSlugs: ["spice-level", "add-ons"] }),
  dish({ slug: "navratan-korma", categorySlug: "curries", name: { en: "Navratan Korma", fr: "Korma aux Neuf Joyaux" }, description: { en: "Creamy vegetable curry with nine vegetables, nuts, dried fruits and aromatic spices, rich and flavorful.", fr: "Plat royal : neuf légumes, noix et fruits secs dans sauce crémeuse aux épices." }, basePriceCents: 2300, containsDairy: true, containsNuts: true, isGlutenFriendly: true, spice: "mild", modifierGroupSlugs: ["spice-level", "add-ons"] }),

  // --- Roti & Naan ----------------------------------------------------------
  dish({ slug: "plain-naan", categorySlug: "roti-naan", name: { en: "Plain Naan", fr: "Naan Nature" }, description: { en: "Soft, fluffy Indian flatbread baked in a tandoor, lightly buttered.", fr: "Pain plat indien classique cuit au tandoor, moelleux, léger et beurré." }, basePriceCents: 300, isPopular: true, containsDairy: true }),
  dish({ slug: "onion-naan", categorySlug: "roti-naan", name: { en: "Onion Naan", fr: "Naan à l'Oignon" }, description: { en: "Soft tandoor-baked flatbread topped with onions, lightly buttered and golden.", fr: "Pain plat moelleux cuit au tandoor, garni d'oignons, légèrement beurré et doré." }, basePriceCents: 500, containsDairy: true }),
  dish({ slug: "tandoori-roti", categorySlug: "roti-naan", name: { en: "Tandoori Roti", fr: "Roti Tandoori" }, description: { en: "Whole-wheat flatbread baked in a clay tandoor, crisp outside, soft inside.", fr: "Pain complet cuit au tandoor, croquant dehors, moelleux dedans." }, basePriceCents: 300, isVegan: true }),
  dish({ slug: "bhatura", categorySlug: "roti-naan", name: { en: "Bhatura", fr: "Bhatura" }, description: { en: "Light, fluffy deep-fried North Indian bread, golden and hot.", fr: "Pain frit nord-indien léger et moelleux, doré, servi chaud." }, basePriceCents: 400 }),
  dish({ slug: "garlic-naan", categorySlug: "roti-naan", name: { en: "Garlic Naan", fr: "Naan à l'Ail" }, description: { en: "Soft tandoor-baked flatbread topped with garlic and herbs, lightly buttered.", fr: "Pain plat moelleux cuit au tandoor, garni d'ail et d'herbes." }, basePriceCents: 400, isPopular: true, isFeatured: true, containsDairy: true }),
  dish({ slug: "chilli-garlic-naan", categorySlug: "roti-naan", name: { en: "Chilli Garlic Naan", fr: "Naan à l'Ail et Piment" }, description: { en: "Soft tandoor-baked flatbread with garlic and green chillies, lightly buttered, bold and spicy.", fr: "Pain plat moelleux au tandoor, parfumé à l'ail et aux piments verts." }, basePriceCents: 500, containsDairy: true, spice: "hot" }),
  dish({ slug: "tawa-roti", categorySlug: "roti-naan", name: { en: "Tawa Roti", fr: "Roti à la Poêle" }, description: { en: "Soft, light whole-wheat flatbread cooked on a hot tawa.", fr: "Pain plat classique à base de farine complète, cuit sur tawa." }, basePriceCents: 300, isVegan: true }),

  // --- Breakfast & Paranthas ------------------------------------------------
  dish({ slug: "amritsari-kulcha", categorySlug: "breakfast-paranthas", name: { en: "Amritsari Kulcha", fr: "Kulcha Amritsari" }, description: { en: "Punjabi stuffed paratha with spiced potato, onion and herb filling, tandoor-cooked, served with butter, chickpea curry and pickle.", fr: "Paratha punjabi farci de pommes de terre épicées, oignons et herbes, cuit au tandoor." }, basePriceCents: 1600, isPopular: true, containsDairy: true, spice: "medium" }),
  dish({ slug: "aloo-parantha", categorySlug: "breakfast-paranthas", name: { en: "Aloo (Potato) Parantha", fr: "Paratha à la Pomme de Terre" }, description: { en: "Traditional flatbread stuffed with spiced potatoes and herbs, cooked on tawa, served with curd, pickle or curry.", fr: "Pain plat farci de pommes de terre et herbes, cuit sur tawa, servi avec yaourt et pickles." }, basePriceCents: 1200, isPopular: true, containsDairy: true, spice: "mild" }),
  dish({ slug: "paneer-parantha", categorySlug: "breakfast-paranthas", name: { en: "Paneer Parantha", fr: "Paratha au Fromage" }, description: { en: "Soft flatbread stuffed with spiced paneer and herbs, cooked on tawa, served with curd, pickle or curry.", fr: "Pain moelleux farci de paneer, épices et herbes, cuit sur tawa." }, basePriceCents: 1500, containsDairy: true, spice: "mild" }),
  dish({ slug: "gobi-parantha", categorySlug: "breakfast-paranthas", name: { en: "Gobi (Cauliflower) Parantha", fr: "Paratha au Chou-fleur" }, description: { en: "Flatbread stuffed with spiced grated cauliflower and herbs, cooked on tawa, crisp outside, soft inside.", fr: "Pain farci de chou-fleur, épices et herbes, cuit sur tawa." }, basePriceCents: 1300, containsDairy: true, spice: "medium" }),
  dish({ slug: "pyaz-parantha", categorySlug: "breakfast-paranthas", name: { en: "Pyaz (Onion) Parantha", fr: "Paratha à l'Oignon" }, description: { en: "Flatbread stuffed with onions, spices and herbs, cooked on tawa, soft and slightly crisp.", fr: "Pain farci d'oignons, épices et herbes, cuit sur tawa, moelleux et légèrement croustillant." }, basePriceCents: 1300, containsDairy: true, spice: "medium" }),

  // --- Drinks ---------------------------------------------------------------
  dish({ slug: "chai", categorySlug: "drinks", name: { en: "Chai", fr: "Thé Indien aux Épices" }, description: { en: "Spiced milk tea brewed to order — ginger, cardamom or masala.", fr: "Thé au lait épicé préparé à la commande — gingembre, cardamome ou masala." }, basePriceCents: 300, isPopular: true, containsDairy: true, modifierGroupSlugs: ["chai-flavour"] }),
  dish({ slug: "salted-lassi", categorySlug: "drinks", name: { en: "Salted Lassi", fr: "Lassi au Sel" }, description: { en: "Creamy yogurt, water and a pinch of salt, served chilled.", fr: "Lassi à base de yaourt crémeux, eau et une pincée de sel, servi frais." }, basePriceCents: 500, containsDairy: true, isGlutenFriendly: true }),
  dish({ slug: "shahi-mango-shake", categorySlug: "drinks", name: { en: "Shahi Mango Shake", fr: "Milkshake Mangue Royal" }, description: { en: "Fresh mango, milk, cardamom and saffron, served chilled with almonds and pistachios.", fr: "Mangue fraîche, lait, cardamome et safran, servi frais avec amandes et pistaches." }, basePriceCents: 1000, isFeatured: true, containsDairy: true, containsNuts: true, isGlutenFriendly: true }),
  dish({ slug: "passion-fruit-lemonade", categorySlug: "drinks", name: { en: "Passion Fruit Lemonade", fr: "Limonade au Fruit de la Passion" }, description: { en: "A fresh, lightly sweet cooler with an exotic passion-fruit twist.", fr: "Boisson fraîche et légèrement sucrée avec une touche exotique." }, basePriceCents: 600, isVegan: true, isGlutenFriendly: true }),
  dish({ slug: "lemon-iced-tea", categorySlug: "drinks", name: { en: "Lemon Iced Tea", fr: "Thé Citron Glacé" }, description: { en: "Classic black tea infused with fresh lemon, lightly sweetened and served cold.", fr: "Thé noir classique infusé au citron frais, légèrement sucré et servi froid." }, basePriceCents: 600, isVegan: true, isGlutenFriendly: true }),
  dish({ slug: "sweet-lassi", categorySlug: "drinks", name: { en: "Sweet Lassi", fr: "Lassi Sucré" }, description: { en: "Creamy yogurt blended with sugar and cardamom, served chilled.", fr: "Yaourt crémeux mélangé avec sucre et cardamome, servi frais." }, basePriceCents: 500, containsDairy: true, isGlutenFriendly: true }),
  dish({ slug: "soda-lemonade", categorySlug: "drinks", name: { en: "Soda Lemonade", fr: "Limonade Gazeuse" }, description: { en: "Zesty lemon, spices and fizzy soda over ice, with black salt and cumin.", fr: "Jus de citron relevé, épices et soda pétillant, servi avec glace, sel noir et cumin." }, basePriceCents: 600, isVegan: true, isGlutenFriendly: true }),
  dish({ slug: "shaadi-wali-coffee", categorySlug: "drinks", name: { en: "Shaadi Wali Coffee", fr: "Café Indien Festif" }, description: { en: "Rich, aromatic Indian-style coffee brewed with milk and sugar — strong, nostalgic and comforting.", fr: "Café indien riche et aromatique, préparé avec lait et sucre." }, basePriceCents: 500, containsDairy: true }),
  dish({ slug: "iced-coffee", categorySlug: "drinks", name: { en: "Iced Coffee", fr: "Café Glacé" }, description: { en: "Smooth chilled coffee blended with milk and a touch of sweetness, served over ice.", fr: "Café glacé onctueux mélangé avec du lait et légèrement sucré, servi avec des glaçons." }, basePriceCents: 600, containsDairy: true }),

  // --- Desserts -------------------------------------------------------------
  dish({ slug: "moong-daal-halwa", categorySlug: "desserts", name: { en: "Moong Daal Halwa", fr: "Pudding aux Lentilles" }, description: { en: "Slow-cooked moong lentils with ghee, milk and dry fruits — rich, soft and nutty-sweet.", fr: "Lentilles moong mijotées avec ghee, lait et fruits secs." }, basePriceCents: 1200, containsDairy: true, containsNuts: true, isGlutenFriendly: true }),
  dish({ slug: "rabri-jalebi", categorySlug: "desserts", name: { en: "Rabri with Jalebi", fr: "Rabri avec Jalebi" }, description: { en: "Crispy, syrupy jalebi served with thick, creamy rabri for a perfect sweet and rich combination.", fr: "Jalebi chaud et croustillant servi avec rabri crémeuse, riche et sucré." }, basePriceCents: 800, containsDairy: true }),
  dish({ slug: "rasmalai", categorySlug: "desserts", name: { en: "Rasmalai", fr: "Boules Tendres au Lait" }, description: { en: "Soft cottage-cheese dumplings in chilled saffron milk, garnished with nuts — light and refreshing.", fr: "Boulettes de paneer moelleuses dans lait sucré au safran, servies froides avec noix." }, basePriceCents: 600, isPopular: true, containsDairy: true, containsNuts: true, isGlutenFriendly: true }),
  dish({ slug: "rabri-falooda", categorySlug: "desserts", name: { en: "Rabri Falooda", fr: "Falooda à la Rabri" }, description: { en: "Royal dessert drink with rabri, vermicelli, basil seeds and rose syrup, topped with ice cream.", fr: "Couches de rabri, vermicelles, graines de basilic et sirop de rose, surmontées de glace." }, basePriceCents: 1200, containsDairy: true, containsNuts: true }),
  dish({ slug: "gajar-halwa", categorySlug: "desserts", name: { en: "Gajar Halwa", fr: "Pudding de Carottes" }, description: { en: "Slow-cooked carrots with milk, ghee, sugar and dry fruits — a warm, comforting Indian dessert.", fr: "Carottes mijotées avec lait, ghee, sucre et fruits secs." }, basePriceCents: 1000, containsDairy: true, containsNuts: true, isGlutenFriendly: true }),
  dish({ slug: "gulab-jamun", categorySlug: "desserts", name: { en: "Gulab Jamun", fr: "Boules Sucrées au Lait" }, description: { en: "Soft, melt-in-the-mouth milk dumplings, deep-fried and soaked in fragrant sugar syrup, served warm.", fr: "Beignets de lait moelleux, frits et trempés dans un sirop parfumé, servis chauds." }, basePriceCents: 500, isPopular: true, isFeatured: true, containsDairy: true }),
  dish({ slug: "royal-brownie-jamun-sundae", categorySlug: "desserts", name: { en: "Royal Brownie Jamun Sundae", fr: "Sundae Royal au Gulab Jamun & Brownie" }, description: { en: "Warm chocolate brownie, soft gulab jamun, ice cream and chocolate sauce — the perfect blend of flavours.", fr: "Brownie chaud, gulab jamun moelleux, glace et sauce chocolat." }, basePriceCents: 1400, containsDairy: true, containsNuts: true }),
  dish({ slug: "royal-gulab-jamun-rabri", categorySlug: "desserts", name: { en: "Royal Gulab Jamun & Rabri", fr: "Gulab Jamun Royal à la Rabri" }, description: { en: "Soft gulab jamun served with thick, creamy rabri — a royal, indulgent finish.", fr: "Gulab Jamun moelleux servi avec rabri épaisse et crémeuse." }, basePriceCents: 1200, containsDairy: true, containsNuts: true }),
];

export const MODIFIER_GROUPS: ModifierGroupSeed[] = [
  {
    slug: "spice-level",
    name: { en: "Spice Level", fr: "Niveau d'Épices" },
    selection: "single",
    minSelect: 1,
    maxSelect: 1,
    isRequired: true,
    options: [
      { name: { en: "Mild", fr: "Doux" }, priceDeltaCents: 0 },
      { name: { en: "Medium", fr: "Moyen" }, priceDeltaCents: 0 },
      { name: { en: "Hot", fr: "Piquant" }, priceDeltaCents: 0 },
      { name: { en: "Extra Hot", fr: "Très Piquant" }, priceDeltaCents: 0 },
    ],
  },
  {
    slug: "add-ons",
    name: { en: "Add-ons", fr: "Suppléments" },
    selection: "multiple",
    minSelect: 0,
    maxSelect: null,
    isRequired: false,
    options: [
      { name: { en: "No Onion", fr: "Sans Oignon" }, priceDeltaCents: 0 },
      { name: { en: "No Coriander", fr: "Sans Coriandre" }, priceDeltaCents: 0 },
      { name: { en: "Extra Sauce", fr: "Sauce Supplémentaire" }, priceDeltaCents: 150 },
      { name: { en: "Add Naan", fr: "Ajouter un Naan" }, priceDeltaCents: 300 },
      { name: { en: "Add Rice", fr: "Ajouter du Riz" }, priceDeltaCents: 400 },
    ],
  },
  {
    slug: "roll-extras",
    name: { en: "Roll Extras", fr: "Extras pour Rouleau" },
    selection: "multiple",
    minSelect: 0,
    maxSelect: null,
    isRequired: false,
    options: [
      { name: { en: "Add Noodles", fr: "Ajouter des Nouilles" }, priceDeltaCents: 300 },
      { name: { en: "Extra Paneer", fr: "Paneer Supplémentaire" }, priceDeltaCents: 300 },
      { name: { en: "Extra Chutney", fr: "Chutney Supplémentaire" }, priceDeltaCents: 100 },
    ],
  },
  {
    slug: "pakora-type",
    name: { en: "Choose Your Pakora", fr: "Choisissez Votre Pakora" },
    selection: "single",
    minSelect: 1,
    maxSelect: 1,
    isRequired: true,
    options: [
      { name: { en: "Aloo (Potato, 8 pcs)", fr: "Aloo (Pomme de terre, 8 pcs)" }, priceDeltaCents: 0 },
      { name: { en: "Gobi (Cauliflower, 8 pcs)", fr: "Gobi (Chou-fleur, 8 pcs)" }, priceDeltaCents: 0 },
      { name: { en: "Mix Veg (8 pcs)", fr: "Mix Légumes (8 pcs)" }, priceDeltaCents: 0 },
      { name: { en: "Paneer (6 pcs)", fr: "Paneer (6 pcs)" }, priceDeltaCents: 300 },
      { name: { en: "Bread Pakoda", fr: "Bread Pakoda" }, priceDeltaCents: 300 },
    ],
  },
  {
    slug: "add-cholle",
    name: { en: "Add Cholle", fr: "Ajouter Cholle" },
    selection: "multiple",
    minSelect: 0,
    maxSelect: 1,
    isRequired: false,
    options: [{ name: { en: "Add Cholle", fr: "Ajouter Cholle" }, priceDeltaCents: 400 }],
  },
  {
    slug: "momo-filling",
    name: { en: "Momo Filling", fr: "Garniture de Momo" },
    selection: "single",
    minSelect: 1,
    maxSelect: 1,
    isRequired: true,
    options: [
      { name: { en: "Veggie", fr: "Légumes" }, priceDeltaCents: 0 },
      { name: { en: "Paneer", fr: "Paneer" }, priceDeltaCents: 300 },
      { name: { en: "Chilli Veggie", fr: "Légumes Pimentés" }, priceDeltaCents: 500 },
    ],
  },
  {
    slug: "momo-prep",
    name: { en: "Preparation", fr: "Préparation" },
    selection: "single",
    minSelect: 1,
    maxSelect: 1,
    isRequired: true,
    options: [
      { name: { en: "Steamed", fr: "Vapeur" }, priceDeltaCents: 0 },
      { name: { en: "Fried", fr: "Frit" }, priceDeltaCents: 100 },
    ],
  },
  {
    slug: "chai-flavour",
    name: { en: "Choose Your Chai", fr: "Choisissez Votre Chai" },
    selection: "single",
    minSelect: 1,
    maxSelect: 1,
    isRequired: true,
    options: [
      { name: { en: "Adrak (Ginger)", fr: "Adrak (Gingembre)" }, priceDeltaCents: 0 },
      { name: { en: "Elaichi (Cardamom)", fr: "Elaichi (Cardamome)" }, priceDeltaCents: 0 },
      { name: { en: "Masala", fr: "Masala" }, priceDeltaCents: 0 },
    ],
  },
  {
    slug: "bowl-grain",
    name: { en: "Choose Your Base", fr: "Choisissez Votre Base" },
    selection: "single",
    minSelect: 1,
    maxSelect: 1,
    isRequired: true,
    options: [
      { name: { en: "Basmati Rice", fr: "Riz Basmati" }, priceDeltaCents: 0 },
      { name: { en: "Quinoa", fr: "Quinoa" }, priceDeltaCents: 150 },
    ],
  },
  {
    slug: "bowl-curry",
    name: { en: "Choose Your Curry", fr: "Choisissez Votre Curry" },
    selection: "single",
    minSelect: 1,
    maxSelect: 1,
    isRequired: true,
    options: [
      { name: { en: "Daal Makhani", fr: "Daal Makhani" }, priceDeltaCents: 0 },
      { name: { en: "Cholle", fr: "Cholle" }, priceDeltaCents: 0 },
      { name: { en: "Rajma", fr: "Rajma" }, priceDeltaCents: 0 },
      { name: { en: "Paneer Butter Masala", fr: "Paneer Butter Masala" }, priceDeltaCents: 200 },
      { name: { en: "Palak Paneer", fr: "Palak Paneer" }, priceDeltaCents: 200 },
      { name: { en: "Malai Chaap", fr: "Malai Chaap" }, priceDeltaCents: 200 },
    ],
  },
  // --- Build Your Thali builder --------------------------------------------
  {
    slug: "thali-bread",
    name: { en: "Choose One Bread", fr: "Choisissez un Pain" },
    selection: "single",
    minSelect: 1,
    maxSelect: 1,
    isRequired: true,
    options: [
      { name: { en: "Plain Naan", fr: "Naan Nature" }, priceDeltaCents: 0 },
      { name: { en: "Garlic Naan", fr: "Naan à l'Ail" }, priceDeltaCents: 100 },
      { name: { en: "Onion Naan", fr: "Naan à l'Oignon" }, priceDeltaCents: 200 },
      { name: { en: "Tandoori Roti", fr: "Roti Tandoori" }, priceDeltaCents: 0 },
    ],
  },
  {
    slug: "thali-grain",
    name: { en: "Rice or Quinoa", fr: "Riz ou Quinoa" },
    selection: "single",
    minSelect: 1,
    maxSelect: 1,
    isRequired: true,
    options: [
      { name: { en: "Basmati Rice", fr: "Riz Basmati" }, priceDeltaCents: 0 },
      { name: { en: "Jeera Rice", fr: "Riz Jeera" }, priceDeltaCents: 100 },
      { name: { en: "Quinoa", fr: "Quinoa" }, priceDeltaCents: 200 },
    ],
  },
  {
    slug: "thali-curries",
    name: { en: "Select Exactly Three Curries", fr: "Choisissez Exactement Trois Currys" },
    selection: "multiple",
    minSelect: 3,
    maxSelect: 3,
    isRequired: true,
    options: [
      { name: { en: "Daal Makhani", fr: "Daal Makhani" }, priceDeltaCents: 0 },
      { name: { en: "Cholle", fr: "Cholle" }, priceDeltaCents: 0 },
      { name: { en: "Rajma", fr: "Rajma" }, priceDeltaCents: 0 },
      { name: { en: "Paneer Butter Masala", fr: "Paneer Butter Masala" }, priceDeltaCents: 200 },
      { name: { en: "Palak Paneer", fr: "Palak Paneer" }, priceDeltaCents: 200 },
      { name: { en: "Aloo Gobi", fr: "Aloo Gobi" }, priceDeltaCents: 0 },
      { name: { en: "Daal Tadka", fr: "Daal Tadka" }, priceDeltaCents: 0 },
    ],
  },
  {
    slug: "thali-side",
    name: { en: "Yogurt or Salad", fr: "Yaourt ou Salade" },
    selection: "single",
    minSelect: 1,
    maxSelect: 1,
    isRequired: true,
    options: [
      { name: { en: "Cucumber Raita", fr: "Raita au Concombre" }, priceDeltaCents: 0 },
      { name: { en: "Garden Salad", fr: "Salade du Jardin" }, priceDeltaCents: 0 },
    ],
  },
  {
    slug: "thali-dessert",
    name: { en: "Select One Dessert", fr: "Choisissez un Dessert" },
    selection: "single",
    minSelect: 1,
    maxSelect: 1,
    isRequired: true,
    options: [
      { name: { en: "Gulab Jamun", fr: "Gulab Jamun" }, priceDeltaCents: 0 },
      { name: { en: "Gajar Halwa", fr: "Gajar Halwa" }, priceDeltaCents: 100 },
    ],
  },
];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
export function dishesByCategory(slug: string) {
  return DISHES.filter((d) => d.categorySlug === slug);
}
export function getDish(slug: string) {
  return DISHES.find((d) => d.slug === slug);
}
export function featuredDishes() {
  return DISHES.filter((d) => d.isFeatured);
}

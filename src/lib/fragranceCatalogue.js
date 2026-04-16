// ScentMuse Verified Fragrance Catalogue
// Auto-classification rules — applied at catalogue build time and on every new entry.
// These rules ensure fragrance_world is always accurate without manual correction.

// ─── HOUSE CLASSIFICATION RULES ──────────────────────────────────────────────
// Rule priority (highest wins):
//  1. Explicit overrides (HOUSE_WORLD_OVERRIDES) — authoritative ground truth
//  2. Middle Eastern origin signal (brand name pattern + known list)
//  3. Artisanal/experimental signal (known independent, discovery-led, small-batch)
//  4. Luxury niche signal (elevated independent, cult-following, >£150 avg)
//  5. Designer fallback

// Known Middle Eastern houses
const MIDDLE_EASTERN_HOUSES = new Set([
  'Afnan', 'Lattafa', 'Armaf', 'Rasasi', 'Swiss Arabian', 'Al Haramain',
  'Ard Al Zaafaran', 'Ajmal', 'Nabeel', 'Orientica', 'Surrati', 'Emper',
  'Maison Alhambra', 'Paris Corner', 'Khalis', 'Fragrance World',
]);

// Artisanal / experimental discovery houses (rare, small-batch, concept-led)
const ARTISANAL_HOUSES = new Set([
  'Etat Libre d\'Orange', 'Orto Parisi', 'Stora Skuggan', 'Imaginary Authors',
  'Slumberhouse', 'Zoologist', 'Olympic Orchids', 'Kerosene', 'Phlur',
  'Henry Rose', 'Commodity', 'D.S. & Durga', 'Malin+Goetz Fragrance',
  'Sweet Tea Apothecary', 'Vilhelm Parfumerie', 'Goldfield & Banks',
]);

// Luxury niche houses — independent, elevated, not mainstream department-store-led
const LUXURY_NICHE_HOUSES = new Set([
  'Maison Francis Kurkdjian', 'Parfums de Marly', 'Amouage', 'Tom Ford',
  'Nishane', 'Initio Parfums Privés', 'Xerjoff', 'Maison Margiela Replica',
  'BDK Parfums', 'Creed', 'Roja Parfums', 'Penhaligon\'s', 'Clive Christian',
  'Memo Paris', 'Morph', 'Fragrance du Bois', 'Tiziana Terenzi',
  'Kilian Paris', 'Parfum de Nicolaï', 'Serge Lutens', 'Le Labo',
  'Diptyque', 'Frederic Malle', 'Juliette Has a Gun', 'Byredo', 'Aesop',
  'Niche House', 'Odin New York', 'Atelier Cologne', 'Caron',
]);

// Designer houses — mainstream luxury department store brands
const DESIGNER_HOUSES = new Set([
  'Chanel', 'Dior', 'Yves Saint Laurent', 'Giorgio Armani', 'Jo Malone',
  'Hermès', 'Carolina Herrera', 'Gucci', 'Prada', 'Burberry', 'Valentino',
  'Givenchy', 'Lancôme', 'Dolce & Gabbana', 'Versace', 'Bvlgari', 'Paco Rabanne',
  'Jean Paul Gaultier', 'Coach', 'Marc Jacobs', 'Michael Kors', 'Calvin Klein',
  'Hugo Boss', 'Davidoff', 'Lacoste', 'Azzaro', 'Moschino', 'Thierry Mugler',
]);

/**
 * Automatically determine the correct fragrance world for a house.
 * Call this whenever adding a new entry to ensure accurate classification.
 *
 * @param {string} brand - The fragrance house name
 * @returns {'middle_eastern'|'artisanal'|'luxury_niche'|'designer'} world
 */
export function classifyHouse(brand) {
  if (MIDDLE_EASTERN_HOUSES.has(brand)) return 'middle_eastern';
  if (ARTISANAL_HOUSES.has(brand)) return 'artisanal';
  if (LUXURY_NICHE_HOUSES.has(brand)) return 'luxury_niche';
  if (DESIGNER_HOUSES.has(brand)) return 'designer';
  // Fallback heuristic: check if brand name suggests Middle Eastern origin
  if (/\b(oud|al |el |ibn |abu |bint |sheikh)\b/i.test(brand)) return 'middle_eastern';
  // Conservative fallback — flag for manual review by defaulting to luxury_niche
  console.warn(`[ScentMuse] Unknown house "${brand}" — defaulted to luxury_niche. Add to classification lists.`);
  return 'luxury_niche';
}

/**
 * Validate an entire catalogue array for world classification accuracy.
 * Logs any mismatches to the console for easy auditing.
 *
 * @param {Array} catalogue
 * @returns {Array} catalogue with world fields corrected
 */
export function validateCatalogueWorlds(catalogue) {
  return catalogue.map(entry => {
    const expected = classifyHouse(entry.brand);
    if (entry.world !== expected) {
      console.warn(
        `[ScentMuse] "${entry.name}" by ${entry.brand}: world="${entry.world}" → corrected to "${expected}"`
      );
      return { ...entry, world: expected };
    }
    return entry;
  });
}


// Each entry is a validated record the AI must select from.
// Fields: name, brand, world, noteFamily, genderLeaning, priceTier, giftingTags, styleTags, releaseYear, trendTags, isNewRelease

export const FRAGRANCE_CATALOGUE = [
  // ─── LUXURY NICHE ────────────────────────────────────────────────────
  { name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", world: "luxury_niche", noteFamily: "amber-floral", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["anniversary","milestone","wow"], styleTags: ["statement","luxe"], releaseYear: 2015, trendTags: ["iconic","viral"], isNewRelease: false },
  { name: "Grand Soir", brand: "Maison Francis Kurkdjian", world: "luxury_niche", noteFamily: "amber", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["evening","milestone"], styleTags: ["opulent","warm"], releaseYear: 2016, trendTags: ["amber-trend"], isNewRelease: false },
  { name: "Aqua Vitae Forte", brand: "Maison Francis Kurkdjian", world: "luxury_niche", noteFamily: "fresh-citrus", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["everyday","summer"], styleTags: ["fresh","clean"], releaseYear: 2019, trendTags: ["citrus-fresh"], isNewRelease: false },
  { name: "Layton", brand: "Parfums de Marly", world: "luxury_niche", noteFamily: "woody-spicy", genderLeaning: "masculine", priceTier: "premium", giftingTags: ["everyday","work","him"], styleTags: ["polished","classic"], releaseYear: 2016, trendTags: ["best-seller"], isNewRelease: false },
  { name: "Sedley", brand: "Parfums de Marly", world: "luxury_niche", noteFamily: "fresh-aquatic", genderLeaning: "masculine", priceTier: "premium", giftingTags: ["summer","everyday"], styleTags: ["fresh","minimal"], releaseYear: 2019, trendTags: ["fresh-trend"], isNewRelease: false },
  { name: "Delina", brand: "Parfums de Marly", world: "luxury_niche", noteFamily: "floral-powdery", genderLeaning: "feminine", priceTier: "premium", giftingTags: ["her","romantic","birthday"], styleTags: ["soft","feminine"], releaseYear: 2017, trendTags: ["best-seller","floral-trend"], isNewRelease: false },
  { name: "Cassili", brand: "Parfums de Marly", world: "luxury_niche", noteFamily: "floral-woody", genderLeaning: "feminine", priceTier: "premium", giftingTags: ["everyday","her"], styleTags: ["polished","warm"], releaseYear: 2018, trendTags: [], isNewRelease: false },
  { name: "Reflection Man", brand: "Amouage", world: "luxury_niche", noteFamily: "fresh-aromatic", genderLeaning: "masculine", priceTier: "ultra", giftingTags: ["him","summer","everyday"], styleTags: ["clean","minimal"], releaseYear: 2007, trendTags: [], isNewRelease: false },
  { name: "Interlude Man", brand: "Amouage", world: "luxury_niche", noteFamily: "woody-spicy", genderLeaning: "masculine", priceTier: "ultra", giftingTags: ["him","evening","bold"], styleTags: ["statement","bold"], releaseYear: 2012, trendTags: [], isNewRelease: false },
  { name: "Guidance", brand: "Amouage", world: "luxury_niche", noteFamily: "woody-amber", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["milestone","anniversary"], styleTags: ["luxe","opulent"], releaseYear: 2024, trendTags: ["new-arrival"], isNewRelease: true },
  { name: "Destiny Woman", brand: "Amouage", world: "luxury_niche", noteFamily: "floral-oriental", genderLeaning: "feminine", priceTier: "ultra", giftingTags: ["her","evening","milestone"], styleTags: ["opulent","statement"], releaseYear: 2014, trendTags: [], isNewRelease: false },
  { name: "Lost Cherry", brand: "Tom Ford", world: "luxury_niche", noteFamily: "fruity-oriental", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["romantic","evening","wow"], styleTags: ["bold","statement"], releaseYear: 2018, trendTags: ["viral","popular"], isNewRelease: false },
  { name: "Oud Wood", brand: "Tom Ford", world: "luxury_niche", noteFamily: "woody-oud", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["him","evening","milestone"], styleTags: ["luxe","warm"], releaseYear: 2007, trendTags: ["classic"], isNewRelease: false },
  { name: "Rose Prick", brand: "Tom Ford", world: "luxury_niche", noteFamily: "floral-spicy", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["her","anniversary","bold"], styleTags: ["statement","floral"], releaseYear: 2020, trendTags: [], isNewRelease: false },
  { name: "Tobacco Vanille", brand: "Tom Ford", world: "luxury_niche", noteFamily: "oriental-gourmand", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["winter","evening","wow"], styleTags: ["warm","opulent"], releaseYear: 2007, trendTags: ["cosy-trend"], isNewRelease: false },
  { name: "Hacivat", brand: "Nishane", world: "luxury_niche", noteFamily: "fresh-woody", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["everyday","him","summer"], styleTags: ["fresh","modern"], releaseYear: 2017, trendTags: ["rising"], isNewRelease: false },
  { name: "Ani", brand: "Nishane", world: "luxury_niche", noteFamily: "floral-woody", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["her","everyday","spring"], styleTags: ["soft","romantic"], releaseYear: 2019, trendTags: [], isNewRelease: false },
  { name: "Fan Your Flames", brand: "Nishane", world: "luxury_niche", noteFamily: "woody-amber", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["evening","bold"], styleTags: ["statement","warm"], releaseYear: 2018, trendTags: [], isNewRelease: false },
  { name: "Mortal Skin", brand: "Nishane", world: "luxury_niche", noteFamily: "powdery-amber", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["intimate","milestone"], styleTags: ["minimal","luxe"], releaseYear: 2021, trendTags: [], isNewRelease: false },
  { name: "Initio Black Gold Project", brand: "Initio Parfums Privés", world: "luxury_niche", noteFamily: "amber-oud", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["milestone","wow","evening"], styleTags: ["bold","opulent"], releaseYear: 2015, trendTags: ["pheromone-trend"], isNewRelease: false },
  { name: "Oud for Greatness", brand: "Initio Parfums Privés", world: "luxury_niche", noteFamily: "oud-spicy", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["bold","him","evening"], styleTags: ["statement","dark"], releaseYear: 2017, trendTags: [], isNewRelease: false },
  { name: "Supernova", brand: "Initio Parfums Privés", world: "luxury_niche", noteFamily: "amber-vanilla", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["winter","evening"], styleTags: ["warm","luxe"], releaseYear: 2023, trendTags: ["new-arrival"], isNewRelease: true },
  { name: "Irisss", brand: "Xerjoff", world: "luxury_niche", noteFamily: "floral-powdery", genderLeaning: "feminine", priceTier: "ultra", giftingTags: ["her","milestone","anniversary"], styleTags: ["luxe","soft"], releaseYear: 2011, trendTags: [], isNewRelease: false },
  { name: "Naxos", brand: "Xerjoff", world: "luxury_niche", noteFamily: "oriental-gourmand", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["evening","winter","wow"], styleTags: ["warm","opulent"], releaseYear: 2012, trendTags: ["cosy-trend"], isNewRelease: false },
  { name: "Alexandria II", brand: "Xerjoff", world: "luxury_niche", noteFamily: "amber-floral", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["milestone","anniversary","wow"], styleTags: ["statement","luxe"], releaseYear: 2011, trendTags: [], isNewRelease: false },
  { name: "Gentle Fluidity Gold", brand: "Maison Margiela Replica", world: "luxury_niche", noteFamily: "woody-amber", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["everyday","winter"], styleTags: ["warm","modern"], releaseYear: 2019, trendTags: [], isNewRelease: false },
  { name: "Jazz Club", brand: "Maison Margiela Replica", world: "luxury_niche", noteFamily: "aromatic-woody", genderLeaning: "masculine", priceTier: "mid", giftingTags: ["him","evening","birthday"], styleTags: ["cool","statement"], releaseYear: 2013, trendTags: [], isNewRelease: false },
  { name: "Fleur de Portofino", brand: "Tom Ford", world: "luxury_niche", noteFamily: "fresh-floral", genderLeaning: "unisex", priceTier: "ultra", giftingTags: ["summer","her","spring"], styleTags: ["fresh","elegant"], releaseYear: 2019, trendTags: [], isNewRelease: false },

  // ─── ARTISANAL / EXPERIMENTAL ────────────────────────────────────────
  { name: "Gris Charnel", brand: "BDK Parfums", world: "artisanal", noteFamily: "floral-woody", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["everyday","her","spring"], styleTags: ["soft","modern"], releaseYear: 2017, trendTags: ["rising"], isNewRelease: false },
  { name: "Crack of Dawn", brand: "BDK Parfums", world: "artisanal", noteFamily: "fresh-woody", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["everyday","summer"], styleTags: ["fresh","clean"], releaseYear: 2020, trendTags: [], isNewRelease: false },
  { name: "Rouge Smoking", brand: "BDK Parfums", world: "artisanal", noteFamily: "floral-amber", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["evening","bold"], styleTags: ["statement","dark"], releaseYear: 2018, trendTags: [], isNewRelease: false },
  { name: "Velvet Tonka", brand: "BDK Parfums", world: "artisanal", noteFamily: "oriental-gourmand", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["autumn","winter","cosy"], styleTags: ["warm","soft"], releaseYear: 2019, trendTags: ["cosy-trend"], isNewRelease: false },
  { name: "White Sandalwood", brand: "Goldfield & Banks", world: "artisanal", noteFamily: "woody-creamy", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["everyday","anniversary"], styleTags: ["minimal","clean"], releaseYear: 2016, trendTags: [], isNewRelease: false },
  { name: "Bohemian Lime", brand: "Goldfield & Banks", world: "artisanal", noteFamily: "fresh-citrus", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["summer","everyday"], styleTags: ["fresh","vibrant"], releaseYear: 2016, trendTags: [], isNewRelease: false },
  { name: "Pacific Rock Moss", brand: "Goldfield & Banks", world: "artisanal", noteFamily: "aromatic-mossy", genderLeaning: "masculine", priceTier: "premium", giftingTags: ["him","everyday","autumn"], styleTags: ["natural","cool"], releaseYear: 2019, trendTags: ["rising"], isNewRelease: false },
  { name: "Whispers in the Library", brand: "Goldfield & Banks", world: "artisanal", noteFamily: "woody-resinous", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["autumn","winter","him"], styleTags: ["warm","dark"], releaseYear: 2021, trendTags: [], isNewRelease: false },
  { name: "Ode to Chaos", brand: "Vilhelm Parfumerie", world: "artisanal", noteFamily: "woody-aromatic", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["him","bold"], styleTags: ["cool","modern"], releaseYear: 2021, trendTags: [], isNewRelease: false },
  { name: "Top of the Morning", brand: "Vilhelm Parfumerie", world: "artisanal", noteFamily: "fresh-green", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["everyday","spring","summer"], styleTags: ["fresh","minimal"], releaseYear: 2018, trendTags: [], isNewRelease: false },

  // ─── MIDDLE EASTERN LUXURY ───────────────────────────────────────────
  { name: "Supremacy Silver", brand: "Afnan", world: "middle_eastern", noteFamily: "fresh-aromatic", genderLeaning: "masculine", priceTier: "accessible", giftingTags: ["him","everyday","summer"], styleTags: ["fresh","clean"], releaseYear: 2018, trendTags: ["value-buy"], isNewRelease: false },
  { name: "Supremacy Noir", brand: "Afnan", world: "middle_eastern", noteFamily: "woody-oriental", genderLeaning: "unisex", priceTier: "accessible", giftingTags: ["evening","bold"], styleTags: ["dark","warm"], releaseYear: 2019, trendTags: [], isNewRelease: false },
  { name: "9PM", brand: "Afnan", world: "middle_eastern", noteFamily: "amber-vanilla", genderLeaning: "unisex", priceTier: "accessible", giftingTags: ["evening","wow","value"], styleTags: ["warm","sweet"], releaseYear: 2020, trendTags: ["viral","value-buy"], isNewRelease: false },
  { name: "Oud Mood", brand: "Lattafa", world: "middle_eastern", noteFamily: "oud-woody", genderLeaning: "unisex", priceTier: "accessible", giftingTags: ["evening","bold","him"], styleTags: ["dark","opulent"], releaseYear: 2021, trendTags: [], isNewRelease: false },
  { name: "Ana Abiyedh Rouge", brand: "Lattafa", world: "middle_eastern", noteFamily: "floral-gourmand", genderLeaning: "feminine", priceTier: "accessible", giftingTags: ["her","romantic","value"], styleTags: ["sweet","soft"], releaseYear: 2020, trendTags: ["viral","value-buy"], isNewRelease: false },
  { name: "Raghba Wood Intense", brand: "Lattafa", world: "middle_eastern", noteFamily: "woody-vanilla", genderLeaning: "unisex", priceTier: "accessible", giftingTags: ["cosy","winter","value"], styleTags: ["warm","sweet"], releaseYear: 2019, trendTags: [], isNewRelease: false },
  { name: "Club de Nuit Intense Man", brand: "Armaf", world: "middle_eastern", noteFamily: "fruity-woody", genderLeaning: "masculine", priceTier: "accessible", giftingTags: ["him","everyday","value"], styleTags: ["bold","fresh"], releaseYear: 2015, trendTags: ["viral","value-buy"], isNewRelease: false },
  { name: "Club de Nuit Intense Woman", brand: "Armaf", world: "middle_eastern", noteFamily: "floral-woody", genderLeaning: "feminine", priceTier: "accessible", giftingTags: ["her","everyday","value"], styleTags: ["polished","fresh"], releaseYear: 2015, trendTags: ["value-buy"], isNewRelease: false },
  { name: "Sillage d'Orient", brand: "Armaf", world: "middle_eastern", noteFamily: "oriental-amber", genderLeaning: "unisex", priceTier: "accessible", giftingTags: ["evening","bold"], styleTags: ["opulent","warm"], releaseYear: 2017, trendTags: [], isNewRelease: false },
  { name: "Shaghaf Oud Aswad", brand: "Swiss Arabian", world: "middle_eastern", noteFamily: "oud-oriental", genderLeaning: "unisex", priceTier: "mid", giftingTags: ["evening","milestone","him"], styleTags: ["dark","opulent"], releaseYear: 2016, trendTags: [], isNewRelease: false },
  { name: "Jannet El Firdaus", brand: "Swiss Arabian", world: "middle_eastern", noteFamily: "floral-oriental", genderLeaning: "feminine", priceTier: "accessible", giftingTags: ["her","romantic"], styleTags: ["soft","sweet"], releaseYear: 2014, trendTags: [], isNewRelease: false },
  { name: "Jawad Al Layl", brand: "Rasasi", world: "middle_eastern", noteFamily: "woody-oriental", genderLeaning: "masculine", priceTier: "accessible", giftingTags: ["him","evening"], styleTags: ["dark","warm"], releaseYear: 2017, trendTags: [], isNewRelease: false },
  { name: "Faqat Lil Rojal", brand: "Rasasi", world: "middle_eastern", noteFamily: "fresh-woody", genderLeaning: "masculine", priceTier: "accessible", giftingTags: ["him","everyday"], styleTags: ["fresh","clean"], releaseYear: 2015, trendTags: [], isNewRelease: false },
  { name: "La Yuqawam", brand: "Rasasi", world: "middle_eastern", noteFamily: "floral-oriental", genderLeaning: "feminine", priceTier: "accessible", giftingTags: ["her","romantic","everyday"], styleTags: ["soft","warm"], releaseYear: 2013, trendTags: [], isNewRelease: false },
  { name: "Al Wisam Day", brand: "Rasasi", world: "middle_eastern", noteFamily: "aromatic-citrus", genderLeaning: "masculine", priceTier: "accessible", giftingTags: ["him","summer","everyday"], styleTags: ["fresh","bold"], releaseYear: 2019, trendTags: [], isNewRelease: false },

  // ─── DESIGNER ────────────────────────────────────────────────────────
  { name: "Bleu de Chanel Parfum", brand: "Chanel", world: "designer", noteFamily: "woody-aromatic", genderLeaning: "masculine", priceTier: "premium", giftingTags: ["him","everyday","birthday"], styleTags: ["polished","classic"], releaseYear: 2018, trendTags: ["best-seller"], isNewRelease: false },
  { name: "Chanel No.5 L'Eau", brand: "Chanel", world: "designer", noteFamily: "floral-aldehyde", genderLeaning: "feminine", priceTier: "premium", giftingTags: ["her","classic","anniversary"], styleTags: ["classic","elegant"], releaseYear: 2016, trendTags: [], isNewRelease: false },
  { name: "Chance Eau Tendre", brand: "Chanel", world: "designer", noteFamily: "floral-fruity", genderLeaning: "feminine", priceTier: "premium", giftingTags: ["her","everyday","spring"], styleTags: ["fresh","romantic"], releaseYear: 2010, trendTags: ["best-seller"], isNewRelease: false },
  { name: "Gabrielle Chanel", brand: "Chanel", world: "designer", noteFamily: "floral-white", genderLeaning: "feminine", priceTier: "premium", giftingTags: ["her","everyday","birthday"], styleTags: ["fresh","minimal"], releaseYear: 2017, trendTags: [], isNewRelease: false },
  { name: "Sauvage Parfum", brand: "Dior", world: "designer", noteFamily: "woody-spicy", genderLeaning: "masculine", priceTier: "premium", giftingTags: ["him","everyday","birthday"], styleTags: ["bold","classic"], releaseYear: 2019, trendTags: ["best-seller"], isNewRelease: false },
  { name: "Miss Dior Blooming Bouquet", brand: "Dior", world: "designer", noteFamily: "floral-powdery", genderLeaning: "feminine", priceTier: "mid", giftingTags: ["her","everyday","spring"], styleTags: ["soft","romantic"], releaseYear: 2014, trendTags: [], isNewRelease: false },
  { name: "Dior Homme Parfum", brand: "Dior", world: "designer", noteFamily: "iris-woody", genderLeaning: "masculine", priceTier: "premium", giftingTags: ["him","evening","milestone"], styleTags: ["polished","elegant"], releaseYear: 2014, trendTags: [], isNewRelease: false },
  { name: "Joy by Dior Intense", brand: "Dior", world: "designer", noteFamily: "floral-woody", genderLeaning: "feminine", priceTier: "premium", giftingTags: ["her","milestone","anniversary"], styleTags: ["luxe","floral"], releaseYear: 2018, trendTags: [], isNewRelease: false },
  { name: "Black Opium Le Parfum", brand: "Yves Saint Laurent", world: "designer", noteFamily: "oriental-gourmand", genderLeaning: "feminine", priceTier: "mid", giftingTags: ["her","evening","birthday"], styleTags: ["bold","warm"], releaseYear: 2023, trendTags: ["best-seller","new-arrival"], isNewRelease: true },
  { name: "Libre Intense", brand: "Yves Saint Laurent", world: "designer", noteFamily: "floral-oriental", genderLeaning: "feminine", priceTier: "mid", giftingTags: ["her","evening","statement"], styleTags: ["bold","statement"], releaseYear: 2020, trendTags: [], isNewRelease: false },
  { name: "Stronger With You Intensely", brand: "Giorgio Armani", world: "designer", noteFamily: "oriental-spicy", genderLeaning: "masculine", priceTier: "mid", giftingTags: ["him","autumn","winter"], styleTags: ["warm","statement"], releaseYear: 2019, trendTags: ["popular"], isNewRelease: false },
  { name: "Si Intense", brand: "Giorgio Armani", world: "designer", noteFamily: "oriental-woody", genderLeaning: "feminine", priceTier: "mid", giftingTags: ["her","evening","bold"], styleTags: ["statement","warm"], releaseYear: 2021, trendTags: [], isNewRelease: false },
  { name: "Wood Sage & Sea Salt", brand: "Jo Malone", world: "designer", noteFamily: "fresh-aromatic", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["everyday","summer","unisex"], styleTags: ["fresh","natural"], releaseYear: 2014, trendTags: ["best-seller"], isNewRelease: false },
  { name: "Peony & Blush Suede", brand: "Jo Malone", world: "designer", noteFamily: "floral-suede", genderLeaning: "feminine", priceTier: "premium", giftingTags: ["her","spring","birthday"], styleTags: ["soft","romantic"], releaseYear: 2012, trendTags: [], isNewRelease: false },
  { name: "Velvet Rose & Oud", brand: "Jo Malone", world: "designer", noteFamily: "floral-oud", genderLeaning: "unisex", priceTier: "premium", giftingTags: ["evening","milestone","wow"], styleTags: ["opulent","romantic"], releaseYear: 2012, trendTags: [], isNewRelease: false },
  { name: "Twilly d'Hermès Eau Poivrée", brand: "Hermès", world: "designer", noteFamily: "floral-spicy", genderLeaning: "feminine", priceTier: "premium", giftingTags: ["her","everyday","spring"], styleTags: ["playful","elegant"], releaseYear: 2021, trendTags: [], isNewRelease: false },
  { name: "H24", brand: "Hermès", world: "designer", noteFamily: "fresh-aromatic", genderLeaning: "masculine", priceTier: "premium", giftingTags: ["him","everyday","spring"], styleTags: ["minimal","modern"], releaseYear: 2021, trendTags: ["rising"], isNewRelease: false },
  { name: "Terre d'Hermès Parfum", brand: "Hermès", world: "designer", noteFamily: "woody-earthy", genderLeaning: "masculine", priceTier: "premium", giftingTags: ["him","everyday","anniversary"], styleTags: ["classic","natural"], releaseYear: 2009, trendTags: ["classic"], isNewRelease: false },
  { name: "Good Girl Légère", brand: "Carolina Herrera", world: "designer", noteFamily: "floral-vanilla", genderLeaning: "feminine", priceTier: "mid", giftingTags: ["her","everyday","birthday"], styleTags: ["soft","sweet"], releaseYear: 2023, trendTags: ["new-arrival"], isNewRelease: true },
  { name: "Y Eau de Parfum", brand: "Yves Saint Laurent", world: "designer", noteFamily: "fresh-woody", genderLeaning: "masculine", priceTier: "mid", giftingTags: ["him","everyday","birthday"], styleTags: ["fresh","modern"], releaseYear: 2018, trendTags: ["popular"], isNewRelease: false },
];

// ─── APPLY AUTO-VALIDATION AT MODULE LOAD ────────────────────────────────────
// Any mis-classified entry will be corrected and logged to console automatically.
// This ensures future additions remain accurate without manual auditing.
validateCatalogueWorlds(FRAGRANCE_CATALOGUE).forEach((entry, i) => {
  FRAGRANCE_CATALOGUE[i] = entry;
});

// Get all fragrances by world(s)
export function getByWorlds(worlds = []) {
  if (!worlds || worlds.length === 0) return FRAGRANCE_CATALOGUE;
  return FRAGRANCE_CATALOGUE.filter(f => worlds.includes(f.world));
}

// Validate a recommendation against the catalogue
export function validateRecommendation(fragranceName, brand) {
  return FRAGRANCE_CATALOGUE.find(
    f => f.name.toLowerCase() === fragranceName.toLowerCase() &&
         f.brand.toLowerCase() === brand.toLowerCase()
  );
}

// Get new arrivals
export function getNewArrivals() {
  return FRAGRANCE_CATALOGUE.filter(f => f.isNewRelease);
}

// Serialise catalogue for LLM prompt injection
export function catalogueToPromptString(worlds = []) {
  const entries = worlds.length ? getByWorlds(worlds) : FRAGRANCE_CATALOGUE;
  return entries.map(f =>
    `• ${f.name} by ${f.brand} [${f.world}] — ${f.noteFamily}, ${f.genderLeaning}, ${f.priceTier} price, gifting: ${f.giftingTags.join('/')}${f.isNewRelease ? ' ★NEW' : ''}`
  ).join('\n');
}
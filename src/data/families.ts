import { PLANTS } from "@/data/plants";

export type Family = {
  slug: string;
  name: string;
  commonName: string;
  order: string;
  genera: number;
  species: number;
  letter: string;
  description: string;
  characteristics: string[];
  distribution: string;
  economicUses: string[];
  campusNotes: string;
};

export const FAMILIES: Family[] = [
  {
    slug: "fabaceae",
    name: "Fabaceae",
    commonName: "Legume / Pea family",
    order: "Fabales",
    genera: 24,
    species: 68,
    letter: "F",
    description:
      "Fabaceae is one of the largest and most economically important plant families on campus. Members range from massive avenue trees to delicate herbs, united by papilionaceous (butterfly-shaped) flowers and legume fruits that fix atmospheric nitrogen through root nodule symbiosis with Rhizobium bacteria.",
    characteristics: [
      "Papilionaceous (bilaterally symmetric) flowers",
      "Compound leaves, often pinnate",
      "Legume fruit (pod) splitting along two sutures",
      "Root nodules for nitrogen fixation",
    ],
    distribution: "Cosmopolitan; especially diverse in tropical and subtropical regions. Dominant in campus avenues, lawns, and disturbed ground.",
    economicUses: ["Timber", "Shade trees", "Green manure", "Fodder", "Ornamental flowering"],
    campusNotes: "The most species-rich family on campus, including golden shower, karanj, acacia, and flamboyant.",
  },
  {
    slug: "meliaceae",
    name: "Meliaceae",
    commonName: "Mahogany family",
    order: "Sapindales",
    genera: 4,
    species: 9,
    letter: "M",
    description:
      "Meliaceae comprises mostly tropical trees and shrubs valued for timber, shade, and medicinal bark and leaves. On campus, the family is best represented by Azadirachta indica (neem), an evergreen avenue tree of exceptional cultural and pesticidal importance.",
    characteristics: [
      "Alternate, usually pinnately compound leaves",
      "Small flowers in panicles",
      "Fruit a capsule, drupe, or berry",
      "Bitter-tasting secondary compounds (limonoids)",
    ],
    distribution: "Pantropical, with centres of diversity in Southeast Asia and the Neotropics.",
    economicUses: ["Timber (mahogany)", "Neem oil and pesticides", "Medicinal extracts", "Shade planting"],
    campusNotes: "Neem trees line several main roads and are among the most frequently documented species.",
  },
  {
    slug: "moraceae",
    name: "Moraceae",
    commonName: "Fig / Mulberry family",
    order: "Rosales",
    genera: 3,
    species: 14,
    letter: "M",
    description:
      "Moraceae includes figs, mulberries, and breadfruit. Many species produce latex and have unique pollination biology. Ficus religiosa (sacred fig) is a landmark tree on campus with religious and ecological significance.",
    characteristics: [
      "Milky latex in stems and leaves",
      "Simple, alternate leaves",
      "Inflorescence a syconium (fig) in many genera",
      "Stipules often encircling the stem",
    ],
    distribution: "Worldwide in tropical and warm temperate zones; figs especially diverse in Asia.",
    economicUses: ["Fruit (fig, jackfruit, breadfruit)", "Silk cultivation (mulberry)", "Sacred and ornamental planting"],
    campusNotes: "Peepal and banyan figs are keystone species providing canopy and wildlife habitat.",
  },
  {
    slug: "apocynaceae",
    name: "Apocynaceae",
    commonName: "Dogbane family",
    order: "Gentianales",
    genera: 8,
    species: 17,
    letter: "A",
    description:
      "Apocynaceae includes herbs, shrubs, and trees often containing milky latex and cardiac glycosides. Oleander is a common ornamental hedge on campus, while other members contribute to traditional medicine.",
    characteristics: [
      "Milky or watery latex",
      "Opposite or whorled leaves",
      "Flowers with five fused petals, often salverform",
      "Fruit a follicle, capsule, or paired drupes",
    ],
    distribution: "Cosmopolitan; most diverse in tropics and subtropics.",
    economicUses: ["Ornamental hedges", "Medicinal alkaloids", "Rubber (some genera)", "Perfumery"],
    campusNotes: "Oleander and related shrubs are planted along boundaries and in formal gardens.",
  },
  {
    slug: "nyctaginaceae",
    name: "Nyctaginaceae",
    commonName: "Four o'clock family",
    order: "Caryophyllales",
    genera: 2,
    species: 5,
    letter: "N",
    description:
      "Nyctaginaceae is known for showy bracts that resemble petals. Bougainvillea, the iconic campus climber with brilliant magenta bracts, belongs to this family and colours walls and pergolas across the grounds.",
    characteristics: [
      "Showy petaloid bracts (not true petals)",
      "Opposite leaves",
      "Flowers often in cymose clusters",
      "Anthocarp fruit (achene surrounded by perianth)",
    ],
    distribution: "Mostly tropical and subtropical Americas; widely cultivated worldwide.",
    economicUses: ["Ornamental climbers and hedges", "Erosion control on slopes", "Landscape colour"],
    campusNotes: "Bougainvillea is one of the most photographed plants on campus.",
  },
  {
    slug: "lamiaceae",
    name: "Lamiaceae",
    commonName: "Mint family",
    order: "Lamiales",
    genera: 11,
    species: 22,
    letter: "L",
    description:
      "Lamiaceae is the mint family — aromatic herbs and shrubs with square stems and opposite leaves. Holy basil (Ocimum tenuiflorum) is cultivated near residential blocks for daily religious and culinary use.",
    characteristics: [
      "Square (quadrangular) stems",
      "Opposite, often aromatic leaves",
      "Bilabiate (two-lipped) flowers",
      "Four nutlets per fruit",
    ],
    distribution: "Cosmopolitan; centre of diversity in the Mediterranean and South Asia.",
    economicUses: ["Culinary herbs", "Essential oils", "Traditional medicine", "Ornamental bedding"],
    campusNotes: "Tulsi and other aromatic herbs grow in herb gardens and near hostels.",
  },
  {
    slug: "oleaceae",
    name: "Oleaceae",
    commonName: "Olive family",
    order: "Lamiales",
    genera: 3,
    species: 8,
    letter: "O",
    description:
      "Oleaceae includes olives, ashes, and jasmines — trees and shrubs with opposite leaves and often fragrant flowers. Jasminum sambac (Arabian jasmine) perfumes evening air near the library lawn.",
    characteristics: [
      "Opposite, simple or pinnate leaves",
      "Four-merous flowers",
      "Fruit a berry, drupe, or samara",
      "Often fragrant corollas",
    ],
    distribution: "Widespread in temperate and tropical regions; jasmines native to South and Southeast Asia.",
    economicUses: ["Olive oil", "Timber (ash, olive)", "Perfumery and garlands (jasmine)", "Ornamental"],
    campusNotes: "Arabian jasmine is planted near walkways for fragrance and cultural use.",
  },
  {
    slug: "arecaceae",
    name: "Arecaceae",
    commonName: "Palm family",
    order: "Arecales",
    genera: 9,
    species: 21,
    letter: "A",
    description:
      "Arecaceae comprises palms — monocot trees and shrubs with unbranched trunks and large fan or feather leaves. Palms define tropical landscaping on campus entrances and ceremonial lawns.",
    characteristics: [
      "Unbranched trunk (stem)",
      "Large compound leaves (pinnate or palmate)",
      "Inflorescence a spadix, often within a spathe",
      "Fruit a berry or drupe, sometimes large",
    ],
    distribution: "Pantropical; most diverse in Southeast Asia and the Neotropics.",
    economicUses: ["Coconut, dates, oil palm", "Thatching and weaving", "Ornamental avenue planting"],
    campusNotes: "Royal palms and date palms mark formal entrances and central lawns.",
  },
  {
    slug: "combretaceae",
    name: "Combretaceae",
    commonName: "Indian almond family",
    order: "Myrtales",
    genera: 2,
    species: 6,
    letter: "C",
    description:
      "Combretaceae includes trees and lianas of tropical wetlands and riverbanks. Terminalia arjuna, a large riparian tree with spongy bark, grows near water features and is valued in traditional cardiac medicine.",
    characteristics: [
      "Simple, alternate leaves, often clustered at branch tips",
      "Small flowers with prominent stamens",
      "Fruit a dry or fleshy drupe, often winged",
      "Bark often thick and corky in riparian species",
    ],
    distribution: "Tropical and subtropical regions worldwide; common along rivers in South Asia.",
    economicUses: ["Timber", "Tanning (myrobalans)", "Ayurvedic medicine", "Shade and riparian planting"],
    campusNotes: "Arjun trees are mapped near drainage channels and the botanical garden pond.",
  },
];

export const FAMILY_LETTERS = ["A", "C", "F", "L", "M", "N", "O", "P"];

export function familySlugFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function getFamilyBySlug(slug: string): Family | undefined {
  return FAMILIES.find((f) => f.slug === slug);
}

export function getPlantsByFamily(familyName: string) {
  return PLANTS.filter((p) => p.family === familyName);
}

export function getCampusSpeciesCount(familyName: string): number {
  return getPlantsByFamily(familyName).length;
}

export function getFamiliesWithCampusCounts() {
  return FAMILIES.map((f) => ({
    ...f,
    campusSpecies: getCampusSpeciesCount(f.name),
    campusGenera: new Set(getPlantsByFamily(f.name).map((p) => p.genus)).size,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export function getRelatedFamilies(family: Family, limit = 4): Family[] {
  return FAMILIES.filter((f) => f.order === family.order && f.slug !== family.slug).slice(0, limit);
}

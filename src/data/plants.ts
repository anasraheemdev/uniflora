export type PlantType =
  | "Big Tree"
  | "Small Tree"
  | "Shrub"
  | "Herb"
  | "Climber"
  | "Palm";

export type Plant = {
  slug: string;
  scientificName: string;
  author?: string;
  commonName: string;
  commonNames?: string[];
  localName?: string;
  family: string;
  genus: string;
  order: string;
  type: PlantType;
  nativeStatus: "Native" | "Exotic";
  medicinal?: boolean;
  habit: string;
  height?: string;
  habitat: string;
  conservationStatus?: string;
  description: string[];
  diagnosticCharacters: { label: string; value: string }[];
  phenology: {
    flowering: number[];
    fruiting: number[];
    floweringLabel: string;
    fruitingLabel: string;
  };
  ethnobotany: { title: string; text: string }[];
  references: string[];
  voucher?: {
    number: string;
    collector: string;
    date: string;
    barcode: string;
  };
  mapLocations: number;
  badgeColor: string;
};

export const PLANTS: Plant[] = [
  {
    slug: "azadirachta-indica",
    scientificName: "Azadirachta indica",
    author: "A. Juss.",
    commonName: "Neem",
    commonNames: ["Neem", "Margosa"],
    localName: "نیم (Nim)",
    family: "Meliaceae",
    genus: "Azadirachta",
    order: "Sapindales",
    type: "Big Tree",
    nativeStatus: "Native",
    medicinal: true,
    habit: "Evergreen tree",
    height: "15–20 m",
    habitat: "Avenues, open ground",
    conservationStatus: "LC",
    description: [
      "Azadirachta indica is a fast-growing evergreen tree reaching 15–20 m in height, with a broad, rounded crown and deeply furrowed grey-brown bark. The tree is highly valued across the campus for its dense shade, drought tolerance, and its extraordinary range of medicinal and pesticidal properties.",
      "Leaves are alternate, imparipinnate, 20–40 cm long, with 8–19 serrated leaflets. Small, fragrant white flowers appear in drooping axillary panicles, followed by smooth yellow-green drupes containing a single seed. It is planted extensively along campus avenues and near residential blocks.",
    ],
    diagnosticCharacters: [
      { label: "Leaf", value: "Imparipinnate, 8–19 serrated leaflets, dark green" },
      { label: "Flower", value: "White, fragrant, in axillary panicles" },
      { label: "Fruit", value: "Smooth ellipsoid drupe, yellow when ripe" },
      { label: "Bark", value: "Grey-brown, longitudinally fissured" },
    ],
    phenology: {
      flowering: [2, 3, 4],
      fruiting: [5, 6, 7],
      floweringLabel: "Flowering (Mar–May)",
      fruitingLabel: "Fruiting (Jun–Aug)",
    },
    ethnobotany: [
      { title: "Medicinal", text: "Antibacterial, antifungal and antiviral; used for skin conditions, dental care and blood purification." },
      { title: "Agriculture", text: "Seed oil (azadirachtin) is a potent natural pesticide and soil amendment." },
      { title: "Timber & Shade", text: "Durable termite-resistant wood; widely planted as an avenue shade tree." },
      { title: "Cultural", text: 'Traditionally regarded as the "village pharmacy" across South Asia.' },
    ],
    references: [
      "Plants of the World Online (POWO), Royal Botanic Gardens, Kew.",
      "World Flora Online — Azadirachta indica A.Juss.",
      "Flora of Pakistan, eFloras.org.",
    ],
    voucher: { number: "UF-HB-0412", collector: "Dr. A. Rehman", date: "14 Apr 2025", barcode: "UNIF00412" },
    mapLocations: 14,
    badgeColor: "#2e6b3a",
  },
  {
    slug: "bougainvillea-glabra",
    scientificName: "Bougainvillea glabra",
    commonName: "Paper Flower",
    family: "Nyctaginaceae",
    genus: "Bougainvillea",
    order: "Caryophyllales",
    type: "Climber",
    nativeStatus: "Exotic",
    habit: "Woody climber",
    habitat: "Walls, fences, pergolas",
    description: ["A vigorous ornamental climber with papery magenta bracts surrounding small white flowers."],
    diagnosticCharacters: [
      { label: "Leaf", value: "Ovate, glabrous, alternate" },
      { label: "Flower", value: "Small white, surrounded by colourful bracts" },
    ],
    phenology: { flowering: [0, 1, 2, 10, 11], fruiting: [], floweringLabel: "Flowering (Nov–Mar)", fruitingLabel: "" },
    ethnobotany: [{ title: "Ornamental", text: "Widely planted for vibrant colour on campus walls and gates." }],
    references: ["Plants of the World Online (POWO), Royal Botanic Gardens, Kew."],
    mapLocations: 8,
    badgeColor: "#8163a8",
  },
  {
    slug: "ficus-religiosa",
    scientificName: "Ficus religiosa",
    commonName: "Peepal",
    family: "Moraceae",
    genus: "Ficus",
    order: "Rosales",
    type: "Big Tree",
    nativeStatus: "Native",
    habit: "Deciduous tree",
    habitat: "Sacred groves, lawns",
    description: ["A large sacred fig with heart-shaped leaves and long tapering tips, often planted near temples and academic buildings."],
    diagnosticCharacters: [
      { label: "Leaf", value: "Cordate with long drip-tip" },
      { label: "Bark", value: "Grey, smooth when young" },
    ],
    phenology: { flowering: [2, 3], fruiting: [4, 5], floweringLabel: "Flowering (Mar–Apr)", fruitingLabel: "Fruiting (May–Jun)" },
    ethnobotany: [{ title: "Cultural", text: "Sacred in Hindu and Buddhist traditions; planted across campus courtyards." }],
    references: ["Flora of Pakistan, eFloras.org."],
    mapLocations: 11,
    badgeColor: "#2e6b3a",
  },
  {
    slug: "cassia-fistula",
    scientificName: "Cassia fistula",
    commonName: "Golden Shower",
    family: "Fabaceae",
    genus: "Cassia",
    order: "Fabales",
    type: "Small Tree",
    nativeStatus: "Native",
    habit: "Deciduous tree",
    habitat: "Open lawns, avenues",
    description: ["Medium-sized tree famous for pendulous racemes of bright yellow flowers in late spring."],
    diagnosticCharacters: [
      { label: "Flower", value: "Bright yellow in long drooping racemes" },
      { label: "Fruit", value: "Cylindrical dark brown pods" },
    ],
    phenology: { flowering: [3, 4, 5], fruiting: [6, 7, 8], floweringLabel: "Flowering (Apr–Jun)", fruitingLabel: "Fruiting (Jul–Sep)" },
    ethnobotany: [{ title: "Ornamental", text: "National flower of Thailand; prized avenue tree on campus." }],
    references: ["World Flora Online."],
    mapLocations: 6,
    badgeColor: "#c99a2e",
  },
  {
    slug: "calliandra-haematocephala",
    scientificName: "Calliandra haematocephala",
    commonName: "Pink Powder Puff",
    family: "Fabaceae",
    genus: "Calliandra",
    order: "Fabales",
    type: "Shrub",
    nativeStatus: "Exotic",
    habit: "Evergreen shrub",
    habitat: "Shrub borders, gardens",
    description: ["Compact shrub with spherical pink-red flower heads resembling powder puffs."],
    diagnosticCharacters: [{ label: "Flower", value: "Globose pink-red inflorescences" }],
    phenology: { flowering: [0, 1, 2, 10, 11], fruiting: [3], floweringLabel: "Flowering (Nov–Mar)", fruitingLabel: "Fruiting (Apr)" },
    ethnobotany: [{ title: "Ornamental", text: "Popular hedge and border plant across campus gardens." }],
    references: ["Plants of the World Online (POWO)."],
    mapLocations: 4,
    badgeColor: "#a63b6b",
  },
  {
    slug: "pongamia-pinnata",
    scientificName: "Pongamia pinnata",
    commonName: "Indian Beech",
    family: "Fabaceae",
    genus: "Pongamia",
    order: "Fabales",
    type: "Big Tree",
    nativeStatus: "Native",
    habit: "Evergreen tree",
    habitat: "Water margins, avenues",
    description: ["Hardy native tree with glossy compound leaves and lilac pea-like flowers."],
    diagnosticCharacters: [{ label: "Leaf", value: "Imparipinnate, glossy" }],
    phenology: { flowering: [2, 3, 4], fruiting: [5, 6], floweringLabel: "Flowering (Mar–May)", fruitingLabel: "Fruiting (Jun–Jul)" },
    ethnobotany: [{ title: "Biofuel", text: "Seeds yield oil used in lamps and biodiesel research." }],
    references: ["Flora of Pakistan."],
    mapLocations: 9,
    badgeColor: "#2e6b3a",
  },
  {
    slug: "acacia-nilotica",
    scientificName: "Acacia nilotica",
    commonName: "Gum Arabic Tree",
    family: "Fabaceae",
    genus: "Acacia",
    order: "Fabales",
    type: "Big Tree",
    nativeStatus: "Native",
    habit: "Thorny tree",
    habitat: "Dry open areas",
    description: ["Thorny tree with paired stipular spines and fragrant yellow flower balls."],
    diagnosticCharacters: [{ label: "Thorns", value: "Paired, straight, white" }],
    phenology: { flowering: [1, 2, 3], fruiting: [4, 5], floweringLabel: "Flowering (Feb–Apr)", fruitingLabel: "Fruiting (May–Jun)" },
    ethnobotany: [{ title: "Timber", text: "Dense durable wood; gum used commercially." }],
    references: ["World Flora Online."],
    mapLocations: 7,
    badgeColor: "#2e6b3a",
  },
  {
    slug: "nerium-oleander",
    scientificName: "Nerium oleander",
    commonName: "Oleander",
    family: "Apocynaceae",
    genus: "Nerium",
    order: "Gentianales",
    type: "Shrub",
    nativeStatus: "Exotic",
    habit: "Evergreen shrub",
    habitat: "Roadsides, borders",
    description: ["Evergreen shrub with lanceolate leaves and showy pink or white flowers; all parts toxic."],
    diagnosticCharacters: [{ label: "Flower", value: "Funnel-shaped, pink or white" }],
    phenology: { flowering: [2, 3, 4, 5, 6, 7, 8], fruiting: [8, 9], floweringLabel: "Flowering (Mar–Sep)", fruitingLabel: "Fruiting (Sep–Oct)" },
    ethnobotany: [{ title: "Toxicity", text: "Highly toxic if ingested; used ornamentally with caution." }],
    references: ["Plants of the World Online."],
    mapLocations: 5,
    badgeColor: "#a63b6b",
  },
  {
    slug: "delonix-regia",
    scientificName: "Delonix regia",
    commonName: "Gulmohar",
    family: "Fabaceae",
    genus: "Delonix",
    order: "Fabales",
    type: "Big Tree",
    nativeStatus: "Exotic",
    habit: "Deciduous tree",
    habitat: "Avenues, lawns",
    description: ["Spectacular flame tree with fern-like leaves and scarlet flowers; iconic campus avenue tree."],
    diagnosticCharacters: [{ label: "Flower", value: "Scarlet with long stamens" }],
    phenology: { flowering: [4, 5, 6], fruiting: [7, 8], floweringLabel: "Flowering (May–Jul)", fruitingLabel: "Fruiting (Aug–Sep)" },
    ethnobotany: [{ title: "Ornamental", text: "One of the most photographed trees on campus during summer." }],
    references: ["World Flora Online."],
    mapLocations: 12,
    badgeColor: "#2e6b3a",
  },
  {
    slug: "jasminum-sambac",
    scientificName: "Jasminum sambac",
    commonName: "Arabian Jasmine",
    family: "Oleaceae",
    genus: "Jasminum",
    order: "Lamiales",
    type: "Shrub",
    nativeStatus: "Exotic",
    habit: "Evergreen shrub",
    habitat: "Gardens, courtyards",
    description: ["Fragrant white flowers used in garlands; compact shrub near residential blocks."],
    diagnosticCharacters: [{ label: "Flower", value: "White, highly fragrant, waxy" }],
    phenology: { flowering: [2, 3, 4, 5, 6, 7, 8, 9], fruiting: [10], floweringLabel: "Flowering (Mar–Oct)", fruitingLabel: "Fruiting (Nov)" },
    ethnobotany: [{ title: "Cultural", text: "Flowers used in ceremonial garlands and perfumes." }],
    references: ["Plants of the World Online."],
    mapLocations: 3,
    badgeColor: "#a63b6b",
  },
  {
    slug: "ocimum-tenuiflorum",
    scientificName: "Ocimum tenuiflorum",
    commonName: "Holy Basil (Tulsi)",
    family: "Lamiaceae",
    genus: "Ocimum",
    order: "Lamiales",
    type: "Herb",
    nativeStatus: "Native",
    medicinal: true,
    habit: "Aromatic herb",
    habitat: "Herb gardens, courtyards",
    description: ["Sacred aromatic herb with purple-tinged leaves; cultivated in campus herb gardens."],
    diagnosticCharacters: [{ label: "Leaf", value: "Ovate, pubescent, aromatic" }],
    phenology: { flowering: [0, 1, 10, 11], fruiting: [2], floweringLabel: "Flowering (Nov–Feb)", fruitingLabel: "Fruiting (Mar)" },
    ethnobotany: [{ title: "Medicinal", text: "Used in traditional medicine and as a sacred plant in households." }],
    references: ["Flora of Pakistan."],
    mapLocations: 2,
    badgeColor: "#5a8a2e",
  },
  {
    slug: "terminalia-arjuna",
    scientificName: "Terminalia arjuna",
    commonName: "Arjuna",
    family: "Combretaceae",
    genus: "Terminalia",
    order: "Myrtales",
    type: "Big Tree",
    nativeStatus: "Native",
    medicinal: true,
    habit: "Large deciduous tree",
    habitat: "Riparian areas, lawns",
    description: ["Large riparian tree with thick spongy bark and small white flowers; bark used medicinally."],
    diagnosticCharacters: [{ label: "Bark", value: "Thick, grey, exfoliating in patches" }],
    phenology: { flowering: [2, 3, 4], fruiting: [5, 6], floweringLabel: "Flowering (Mar–May)", fruitingLabel: "Fruiting (Jun–Jul)" },
    ethnobotany: [{ title: "Medicinal", text: "Bark used in Ayurvedic cardiac tonics." }],
    references: ["World Flora Online."],
    mapLocations: 6,
    badgeColor: "#2e6b3a",
  },
];

export const STATS = {
  species: 512,
  families: 128,
  genera: 340,
  locations: 346,
  images: 2845,
  vouchers: 2845,
  collectors: 37,
};

export function getPlantBySlug(slug: string): Plant | undefined {
  return PLANTS.find((p) => p.slug === slug);
}

export const RECENT_PLANTS = PLANTS.slice(0, 5);

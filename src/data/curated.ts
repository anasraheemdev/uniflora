/**
 * Hand-written botanical detail layered on top of the survey import.
 *
 * The survey (see `src/data/generated/`) is the source of truth for which
 * species exist on campus and where they grow. It carries no prose, so these
 * profiles fill in description, diagnostics, phenology and uses for the species
 * we have written up so far. Everything here is keyed by the generated slug;
 * an entry whose slug is absent from the survey is simply ignored.
 */

export type CuratedPhenology = {
  flowering: number[];
  fruiting: number[];
  floweringLabel: string;
  fruitingLabel: string;
};

export type CuratedProfile = {
  commonName?: string;
  order?: string;
  nativeStatus?: "Native" | "Exotic";
  medicinal?: boolean;
  height?: string;
  habitat?: string;
  conservationStatus?: string;
  description?: string[];
  diagnosticCharacters?: { label: string; value: string }[];
  phenology?: CuratedPhenology;
  ethnobotany?: { title: string; text: string }[];
  references?: string[];
  voucher?: { number: string; collector: string; date: string; barcode: string };
};

export const CURATED_PROFILES: Record<string, CuratedProfile> = {
  "azadirachta-indica": {
    commonName: "Neem",
    order: "Sapindales",
    nativeStatus: "Native",
    medicinal: true,
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
  },

  "bougainvillea-glabra": {
    commonName: "Paper Flower",
    order: "Caryophyllales",
    nativeStatus: "Exotic",
    habitat: "Walls, fences, pergolas",
    description: [
      "A vigorous ornamental climber grown throughout the campus for the papery magenta bracts that surround its small, inconspicuous white flowers. The colour that reads as petals is bract tissue, which is why the display lasts for months.",
    ],
    diagnosticCharacters: [
      { label: "Leaf", value: "Ovate, glabrous, alternate" },
      { label: "Flower", value: "Small white tube, surrounded by three coloured bracts" },
      { label: "Stem", value: "Woody, thorny, scrambling" },
    ],
    phenology: {
      flowering: [0, 1, 2, 10, 11],
      fruiting: [],
      floweringLabel: "Flowering (Nov–Mar)",
      fruitingLabel: "",
    },
    ethnobotany: [
      { title: "Ornamental", text: "Widely planted for vibrant colour on campus walls and gates." },
    ],
    references: ["Plants of the World Online (POWO), Royal Botanic Gardens, Kew."],
  },

  "ficus-religiosa": {
    commonName: "Peepal",
    order: "Rosales",
    nativeStatus: "Native",
    habitat: "Courtyards, lawns",
    description: [
      "A large sacred fig with heart-shaped leaves drawn out into a long tapering drip-tip — the single most reliable field character for the species. Mature trees develop a broad spreading crown and are often the oldest trees on a campus.",
    ],
    diagnosticCharacters: [
      { label: "Leaf", value: "Cordate with a long, slender drip-tip" },
      { label: "Bark", value: "Grey, smooth when young" },
      { label: "Fruit", value: "Paired sessile figs, purple when ripe" },
    ],
    phenology: {
      flowering: [2, 3],
      fruiting: [4, 5],
      floweringLabel: "Flowering (Mar–Apr)",
      fruitingLabel: "Fruiting (May–Jun)",
    },
    ethnobotany: [
      { title: "Cultural", text: "Sacred in Hindu and Buddhist traditions; planted across campus courtyards." },
      { title: "Ecological", text: "Figs support birds and fruit bats year-round, making it a keystone campus species." },
    ],
    references: ["Flora of Pakistan, eFloras.org."],
  },

  "cassia-fistula": {
    commonName: "Golden Shower",
    order: "Fabales",
    nativeStatus: "Native",
    habitat: "Open lawns, avenues",
    description: [
      "A medium-sized deciduous tree famous for the pendulous racemes of bright yellow flowers it produces in late spring, followed by long cylindrical pods that persist on the tree well into the following season.",
    ],
    diagnosticCharacters: [
      { label: "Flower", value: "Bright yellow, in long drooping racemes" },
      { label: "Fruit", value: "Cylindrical dark brown pod, 30–60 cm" },
      { label: "Leaf", value: "Pinnate with 3–8 pairs of large leaflets" },
    ],
    phenology: {
      flowering: [3, 4, 5],
      fruiting: [6, 7, 8],
      floweringLabel: "Flowering (Apr–Jun)",
      fruitingLabel: "Fruiting (Jul–Sep)",
    },
    ethnobotany: [
      { title: "Ornamental", text: "Prized avenue tree; among the most conspicuous flowering trees on campus in early summer." },
      { title: "Traditional use", text: "Pod pulp has a long history of use as a mild laxative in South Asian medicine." },
    ],
    references: ["World Flora Online."],
  },

  "pongamia-pinnata": {
    commonName: "Indian Beech",
    order: "Fabales",
    nativeStatus: "Native",
    habitat: "Water margins, avenues",
    description: [
      "A hardy native tree with glossy compound leaves and lilac pea-like flowers, tolerant of poor and saline soils. It is a nitrogen fixer, so it is often planted where soil improvement is wanted alongside shade.",
    ],
    diagnosticCharacters: [
      { label: "Leaf", value: "Imparipinnate, glossy, 5–7 leaflets" },
      { label: "Flower", value: "Lilac to pinkish-white, pea-like" },
      { label: "Fruit", value: "Flattened woody pod with a single seed" },
    ],
    phenology: {
      flowering: [2, 3, 4],
      fruiting: [5, 6],
      floweringLabel: "Flowering (Mar–May)",
      fruitingLabel: "Fruiting (Jun–Jul)",
    },
    ethnobotany: [
      { title: "Biofuel", text: "Seeds yield an oil used in lamps and studied widely for biodiesel." },
      { title: "Soil", text: "Nitrogen-fixing root nodules improve degraded and saline ground." },
    ],
    references: ["Flora of Pakistan."],
  },

  "vachellia-nilotica": {
    commonName: "Kikar",
    order: "Fabales",
    nativeStatus: "Native",
    habitat: "Dry open ground",
    description: [
      "A thorny native tree, formerly placed in Acacia, recognised by its paired straight stipular spines and fragrant golden flower balls. It persists on the drier, less managed edges of the campus.",
    ],
    diagnosticCharacters: [
      { label: "Thorns", value: "Paired, straight, white stipular spines" },
      { label: "Flower", value: "Bright yellow globose heads" },
      { label: "Fruit", value: "Necklace-like constricted pod" },
    ],
    phenology: {
      flowering: [1, 2, 3],
      fruiting: [4, 5],
      floweringLabel: "Flowering (Feb–Apr)",
      fruitingLabel: "Fruiting (May–Jun)",
    },
    ethnobotany: [
      { title: "Timber", text: "Dense, durable wood used for tool handles and agricultural implements." },
      { title: "Gum", text: "Source of gum arabic, traded commercially across the region." },
    ],
    references: ["World Flora Online — Vachellia nilotica (L.) P.J.H.Hurter & Mabb."],
  },

  "nerium-oleander": {
    commonName: "Oleander",
    order: "Gentianales",
    nativeStatus: "Exotic",
    habitat: "Roadsides, borders",
    description: [
      "An evergreen shrub with narrow leathery leaves in whorls of three and showy pink or white funnel-shaped flowers. Every part of the plant is highly toxic, which is worth knowing given how widely it is planted along paths.",
    ],
    diagnosticCharacters: [
      { label: "Leaf", value: "Narrow, leathery, in whorls of three" },
      { label: "Flower", value: "Funnel-shaped, pink or white" },
      { label: "Sap", value: "Milky latex, toxic" },
    ],
    phenology: {
      flowering: [2, 3, 4, 5, 6, 7, 8],
      fruiting: [8, 9],
      floweringLabel: "Flowering (Mar–Sep)",
      fruitingLabel: "Fruiting (Sep–Oct)",
    },
    ethnobotany: [
      { title: "Toxicity", text: "All parts contain cardiac glycosides and are dangerous if ingested. Planted ornamentally with caution." },
      { title: "Ornamental", text: "Drought-hardy screening shrub used along roads and boundaries." },
    ],
    references: ["Plants of the World Online."],
  },

  "delonix-regia": {
    commonName: "Gulmohar",
    order: "Fabales",
    nativeStatus: "Exotic",
    habitat: "Avenues, lawns",
    description: [
      "The flame tree: fern-like bipinnate foliage and scarlet flowers that cover the crown in early summer. Native to Madagascar and endangered in the wild, though planted throughout the tropics.",
    ],
    diagnosticCharacters: [
      { label: "Flower", value: "Scarlet, with one white-streaked banner petal" },
      { label: "Leaf", value: "Bipinnate, fern-like" },
      { label: "Fruit", value: "Long woody pod, up to 60 cm" },
    ],
    phenology: {
      flowering: [4, 5, 6],
      fruiting: [7, 8],
      floweringLabel: "Flowering (May–Jul)",
      fruitingLabel: "Fruiting (Aug–Sep)",
    },
    ethnobotany: [
      { title: "Ornamental", text: "One of the most photographed trees on campus during summer flowering." },
    ],
    references: ["World Flora Online."],
  },

  "jasminum-sambac": {
    commonName: "Motia",
    order: "Lamiales",
    nativeStatus: "Exotic",
    habitat: "Gardens, courtyards",
    description: [
      "A compact evergreen shrub bearing intensely fragrant waxy white flowers that turn cream as they age. Widely grown near residential blocks and gathered for garlands.",
    ],
    diagnosticCharacters: [
      { label: "Flower", value: "White, waxy, highly fragrant" },
      { label: "Leaf", value: "Broadly ovate, opposite, glossy" },
    ],
    phenology: {
      flowering: [2, 3, 4, 5, 6, 7, 8, 9],
      fruiting: [10],
      floweringLabel: "Flowering (Mar–Oct)",
      fruitingLabel: "Fruiting (Nov)",
    },
    ethnobotany: [
      { title: "Cultural", text: "Flowers used in ceremonial garlands and perfumery across Pakistan." },
    ],
    references: ["Plants of the World Online."],
  },

  "terminalia-arjuna": {
    commonName: "Arjan",
    order: "Myrtales",
    nativeStatus: "Native",
    medicinal: true,
    habitat: "Lawns, watercourses",
    description: [
      "A large tree with a distinctive thick, pale grey bark that flakes away in broad sheets, and a buttressed base on older individuals. Traditionally planted near water.",
    ],
    diagnosticCharacters: [
      { label: "Bark", value: "Thick, pale grey, exfoliating in large flakes" },
      { label: "Leaf", value: "Sub-opposite, oblong, with two glands at the base" },
    ],
    phenology: {
      flowering: [2, 3, 4],
      fruiting: [5, 6],
      floweringLabel: "Flowering (Mar–May)",
      fruitingLabel: "Fruiting (Jun–Jul)",
    },
    ethnobotany: [
      { title: "Medicinal", text: "Bark is the basis of long-standing Ayurvedic cardiac preparations." },
    ],
    references: ["World Flora Online."],
  },
};

/** Taxonomic orders for families we have written up. */
export const FAMILY_ORDERS: Record<string, string> = {
  Meliaceae: "Sapindales",
  Nyctaginaceae: "Caryophyllales",
  Moraceae: "Rosales",
  Fabaceae: "Fabales",
  Apocynaceae: "Gentianales",
  Oleaceae: "Lamiales",
  Lamiaceae: "Lamiales",
  Combretaceae: "Myrtales",
  Arecaceae: "Arecales",
  Myrtaceae: "Myrtales",
  Annonaceae: "Magnoliales",
  Euphorbiaceae: "Malpighiales",
  Malvaceae: "Malvales",
  Rutaceae: "Sapindales",
  Poaceae: "Poales",
  Asteraceae: "Asterales",
  Solanaceae: "Solanales",
  Amaranthaceae: "Caryophyllales",
  Brassicaceae: "Brassicales",
  Cucurbitaceae: "Cucurbitales",
  Verbenaceae: "Lamiales",
  Acanthaceae: "Lamiales",
  Convolvulaceae: "Solanales",
  Cyperaceae: "Poales",
  Rosaceae: "Rosales",
};

/** Short profiles for families we have written up. */
export const CURATED_FAMILIES: Record<
  string,
  { commonName: string; description: string; characteristics: string[]; distribution: string; economicUses: string[] }
> = {
  Fabaceae: {
    commonName: "Legume / Pea family",
    description:
      "One of the largest and most economically important plant families on campus. Members range from large avenue trees to small herbs, united by pea-like flowers and pod fruits, and by root nodules that fix atmospheric nitrogen in symbiosis with Rhizobium bacteria.",
    characteristics: [
      "Papilionaceous (bilaterally symmetric) flowers",
      "Compound leaves, often pinnate",
      "Legume fruit (pod) splitting along two sutures",
      "Root nodules for nitrogen fixation",
    ],
    distribution: "Cosmopolitan, and especially diverse in tropical and subtropical regions.",
    economicUses: ["Timber", "Shade trees", "Green manure", "Fodder", "Ornamental flowering"],
  },
  Meliaceae: {
    commonName: "Mahogany family",
    description:
      "Mostly tropical trees and shrubs valued for timber, shade, and the bitter limonoid compounds in their bark and leaves. On this campus the family is dominated by neem and bakain, two of the most abundant planted trees.",
    characteristics: [
      "Alternate, usually pinnately compound leaves",
      "Small flowers in panicles",
      "Fruit a capsule, drupe or berry",
      "Bitter limonoid secondary compounds",
    ],
    distribution: "Pantropical, with centres of diversity in Southeast Asia and the Neotropics.",
    economicUses: ["Timber", "Neem oil and biopesticides", "Medicinal extracts", "Shade planting"],
  },
  Moraceae: {
    commonName: "Fig / Mulberry family",
    description:
      "Figs and mulberries, most of which produce milky latex. The figs have an unusual enclosed inflorescence (the syconium) pollinated by specialist wasps, and are among the most ecologically valuable trees on any campus.",
    characteristics: [
      "Milky latex in stems and leaves",
      "Simple, alternate leaves",
      "Inflorescence a syconium (fig) in Ficus",
      "Stipules often encircling the stem",
    ],
    distribution: "Worldwide in tropical and warm temperate zones; Ficus is especially diverse in Asia.",
    economicUses: ["Edible fruit", "Silk cultivation (mulberry)", "Shade and ornamental planting"],
  },
  Arecaceae: {
    commonName: "Palm family",
    description:
      "Palms are unmistakable in growth form: an unbranched trunk topped by a crown of large pinnate or fan-shaped leaves. They are planted heavily along the main approaches of the campus for their architectural effect.",
    characteristics: [
      "Unbranched woody trunk with a terminal leaf crown",
      "Large pinnate (feather) or palmate (fan) leaves",
      "Flowers small, in large branched inflorescences",
      "Fruit a drupe",
    ],
    distribution: "Pantropical, with a few species extending into warm temperate regions.",
    economicUses: ["Avenue and ornamental planting", "Dates and edible fruit", "Fibre and thatch"],
  },
  Myrtaceae: {
    commonName: "Myrtle family",
    description:
      "Aromatic trees and shrubs with oil glands in the leaves, which release a distinctive scent when crushed. Eucalypts, jaman and bottlebrush all fall here and are widely planted across the campus.",
    characteristics: [
      "Leaves with translucent aromatic oil glands",
      "Numerous conspicuous stamens",
      "Entire, often opposite leaves",
      "Fruit a capsule or berry",
    ],
    distribution: "Centred on Australia and the Neotropics; widely planted elsewhere.",
    economicUses: ["Timber and fuelwood", "Essential oils", "Edible fruit", "Ornamental planting"],
  },
  Apocynaceae: {
    commonName: "Dogbane family",
    description:
      "Trees, shrubs and climbers with milky latex and often five-lobed, pinwheel-shaped flowers. Many members are toxic, and several of the campus's most common ornamentals belong here.",
    characteristics: [
      "Milky latex",
      "Opposite or whorled simple leaves",
      "Five-lobed salver-shaped flowers",
      "Paired follicle fruits in many genera",
    ],
    distribution: "Mainly tropical and subtropical worldwide.",
    economicUses: ["Ornamental planting", "Traditional medicine", "Timber (Alstonia)"],
  },
};

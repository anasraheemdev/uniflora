import type { Family } from "@/data/families";
import type { Plant } from "@/data/plants";

function matches(q: string, ...keywords: string[]): boolean {
  return keywords.some((k) => q.includes(k));
}

function formatDiagnostics(plant: Plant): string {
  return plant.diagnosticCharacters
    .map((d) => `• **${d.label}:** ${d.value}`)
    .join("\n");
}

function formatEthnobotany(plant: Plant): string {
  return plant.ethnobotany.map((e) => `• **${e.title}:** ${e.text}`).join("\n");
}

export function getSuggestedQuestions(plant: { commonName: string; medicinal?: boolean }): string[] {
  const name = plant.commonName;
  return [
    `How can I identify ${name}?`,
    `What are the uses of ${name}?`,
    `When does ${name} flower on campus?`,
    `Where can I find ${name} on the map?`,
    ...(plant.medicinal ? [`What are the medicinal properties of ${name}?`] : []),
  ];
}

/** Rule-based assistant grounded in catalogue data (no external API). */
export function answerPlantQuestion(plant: Plant, question: string, family?: Family): string {
  const q = question.trim().toLowerCase();
  const name = plant.commonName;
  const sci = plant.scientificName;

  if (!q || matches(q, "hello", "hi", "hey", "salam", "assalam")) {
    return `Hello! I'm the UniFlora AI assistant. Ask me anything about **${name}** (*${sci}*) — identification, uses, flowering time, campus locations, or taxonomy.`;
  }

  if (matches(q, "identif", "diagnostic", "distinguish", "tell apart", "look like", "recognize", "recognise", "key feature", "how to spot")) {
    return `To identify **${name}** (*${sci}*), look for these diagnostic characters:\n\n${formatDiagnostics(plant)}\n\nIt is classified as a **${plant.type}** with habit: ${plant.habit}.${plant.height ? ` Typical height: ${plant.height}.` : ""}`;
  }

  if (matches(q, "medicin", "heal", "health", "remedy", "ayurved", "traditional medicine", "pharmac")) {
    if (!plant.medicinal && plant.ethnobotany.every((e) => !e.title.toLowerCase().includes("medic"))) {
      return `**${name}** is not flagged as a primary medicinal species in our campus catalogue. Documented uses:\n\n${formatEthnobotany(plant)}`;
    }
    const medicinal = plant.ethnobotany.filter(
      (e) => e.title.toLowerCase().includes("medic") || matches(e.text.toLowerCase(), "medic", "heal", "tonic", "antibact"),
    );
    const items = medicinal.length > 0 ? medicinal : plant.ethnobotany;
    return `**${name}** has documented ethnobotanical value:\n\n${items.map((e) => `• **${e.title}:** ${e.text}`).join("\n")}\n\n⚠️ This is educational information from the UniFlora database — not medical advice. Consult a qualified practitioner before therapeutic use.`;
  }

  if (matches(q, "flower", "bloom", "blossom", "phenolog", "season", "when does it")) {
    const flowering = plant.phenology.floweringLabel || "Flowering period not fully documented.";
    const fruiting = plant.phenology.fruitingLabel;
    return `**${name}** phenology on campus:\n\n• **Flowering:** ${flowering}${fruiting ? `\n• **Fruiting:** ${fruiting}` : ""}\n\nPhenology can vary slightly year to year depending on rainfall and temperature.`;
  }

  if (matches(q, "fruit", "seed", "drupe", "pod", "berry")) {
    const fruitChar = plant.diagnosticCharacters.find((d) => matches(d.label.toLowerCase(), "fruit", "seed"));
    const fruiting = plant.phenology.fruitingLabel || "Fruiting period not specified.";
    let answer = `**Fruiting:** ${fruiting}`;
    if (fruitChar) answer += `\n\n**Fruit character:** ${fruitChar.value}`;
    return answer;
  }

  if (matches(q, "leaf", "leaves", "foliage")) {
    const leaf = plant.diagnosticCharacters.find((d) => d.label.toLowerCase().includes("leaf"));
    if (leaf) return `**Leaf characters of ${name}:**\n\n• ${leaf.value}\n\n${plant.description[0] ?? ""}`;
    return `Leaf details for **${name}** are in the diagnostic section. ${plant.description.join(" ")}`;
  }

  if (matches(q, "bark", "stem", "trunk")) {
    const bark = plant.diagnosticCharacters.find((d) => matches(d.label.toLowerCase(), "bark", "stem"));
    if (bark) return `**Bark / stem:** ${bark.value}`;
    return `Bark characters are not separately documented for **${name}**. General description: ${plant.description[0] ?? "See species page."}`;
  }

  if (matches(q, "campus", "map", "location", "where", "find", "grow", "planted", "avenue", "garden")) {
    return `**${name}** is documented at **${plant.mapLocations} mapped location${plant.mapLocations === 1 ? "" : "s"}** on campus, typically in: **${plant.habitat}**.\n\nOpen the [Campus Map](/map) to see GPS markers and zones for this species.`;
  }

  if (matches(q, "habitat", "ecolog", "environment", "soil", "climate")) {
    return `On our campus, **${name}** is typically found in: **${plant.habitat}**.\n\nNative status: **${plant.nativeStatus}**. Habit: ${plant.habit}.`;
  }

  if (matches(q, "family", "taxon", "genus", "order", "relative", "classification", "related")) {
    let answer = `**Taxonomy of ${name}:**\n\n• **Family:** ${plant.family}\n• **Genus:** *${plant.genus}*\n• **Order:** ${plant.order}`;
    if (family) {
      answer += `\n\n**About ${family.name}:** ${family.description}\n\nCampus note: ${family.campusNotes}`;
    }
    return answer;
  }

  if (matches(q, "use", "ethnobot", "cultural", "timber", "ornament", "food", "agricult", "economic", "purpose", "benefit")) {
    return `**Uses & ethnobotany of ${name}:**\n\n${formatEthnobotany(plant)}`;
  }

  if (matches(q, "height", "size", "tall", "canopy", "dimension", "mature")) {
    const parts = [`**Habit:** ${plant.habit}`];
    if (plant.height) parts.push(`**Height:** ${plant.height}`);
    parts.push(`**Type:** ${plant.type}`);
    return parts.join("\n");
  }

  if (matches(q, "native", "exotic", "introduced", "invasive", "conserv", "iucn", "status", "endanger")) {
    let answer = `**${name}** is recorded as **${plant.nativeStatus}** on campus.`;
    if (plant.conservationStatus) answer += ` IUCN/conservation code: **${plant.conservationStatus}**.`;
    return answer;
  }

  if (matches(q, "reference", "source", "citation", "literature", "where did", "proof")) {
    return `**References for ${name}:**\n\n${plant.references.map((r) => `• ${r}`).join("\n")}`;
  }

  if (matches(q, "voucher", "herbarium", "specimen", "collector", "barcode")) {
    if (!plant.voucher) {
      return `No herbarium voucher is linked to **${name}** in the current catalogue. Browse [Collections](/collections) for other specimens.`;
    }
    const v = plant.voucher;
    return `**Herbarium voucher for ${name}:**\n\n• **Voucher:** ${v.number}\n• **Collector:** ${v.collector}\n• **Date:** ${v.date}\n• **Barcode:** ${v.barcode}\n\nView digitised sheets in [Collections](/collections).`;
  }

  if (matches(q, "describe", "about", "what is", "tell me", "overview", "summary", "introduce", "information")) {
    return `**${name}** (*${sci}*) belongs to **${plant.family}**.\n\n${plant.description.join("\n\n")}\n\n**Quick facts:** ${plant.type} · ${plant.nativeStatus} · ${plant.habitat}`;
  }

  if (matches(q, "name", "called", "common", "local", "urdu", "vernacular")) {
    const names = [plant.commonName, ...(plant.commonNames ?? []).filter((n) => n !== plant.commonName)];
    let answer = `**Names for ${sci}:**\n\n• **Common:** ${names.join(", ")}`;
    if (plant.localName) answer += `\n• **Local:** ${plant.localName}`;
    return answer;
  }

  // Keyword overlap fallback — search description and ethnobotany
  const corpus = [
    ...plant.description,
    ...plant.ethnobotany.map((e) => `${e.title} ${e.text}`),
    ...plant.diagnosticCharacters.map((d) => `${d.label} ${d.value}`),
  ].join(" ");

  const words = q.split(/\s+/).filter((w) => w.length > 3);
  const hits = words.filter((w) => corpus.toLowerCase().includes(w));
  if (hits.length >= 2) {
    return `Based on our records for **${name}**, here is relevant information:\n\n${plant.description.join(" ")}\n\n**Uses:**\n${formatEthnobotany(plant)}`;
  }

  return `I can help with **${name}** (*${sci}*) using UniFlora's campus database. Try asking about:\n\n• Identification & diagnostic characters\n• Flowering and fruiting seasons\n• Medicinal or cultural uses\n• Campus map locations\n• Family and taxonomy\n\nOr tap one of the suggested questions above.`;
}

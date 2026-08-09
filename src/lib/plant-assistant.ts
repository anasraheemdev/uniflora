import type { Family } from "@/data/families";
import type { Plant } from "@/data/plants";

function matches(q: string, ...keywords: string[]): boolean {
  return keywords.some((k) => q.includes(k));
}

function formatDiagnostics(plant: Plant): string {
  return plant.diagnosticCharacters.map((d) => `• **${d.label}:** ${d.value}`).join("\n");
}

function formatEthnobotany(plant: Plant): string {
  return plant.ethnobotany.map((e) => `• **${e.title}:** ${e.text}`).join("\n");
}

/** What the survey alone can tell us — always available, even with no written profile. */
function surveyFacts(plant: Plant): string {
  const lines = [
    `• **Family:** ${plant.family}`,
    `• **Genus:** *${plant.genus}*`,
    `• **Habit:** ${plant.habit} (${plant.lifeForm.toLowerCase()})`,
    `• **On campus:** ${plant.growthStatus.toLowerCase()}`,
  ];
  if (plant.occurrences > 0) {
    lines.push(`• **Mapped individuals:** ${plant.occurrences} across ${plant.zones.length} zone${plant.zones.length === 1 ? "" : "s"}`);
  }
  if (plant.localNames.length) {
    lines.push(`• **Local name${plant.localNames.length > 1 ? "s" : ""}:** ${plant.localNames.join(", ")}`);
  }
  return lines.join("\n");
}

function noProfileNote(plant: Plant): string {
  return `\n\n_We do not have a written botanical profile for ${plant.scientificName} yet — the details above come from the campus floristic survey._`;
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

  if (!q || matches(q, "hello", "hi ", "hey", "salam", "assalam")) {
    return `Hello! I'm the UniFlora AI assistant. Ask me anything about **${name}** (*${sci}*) — identification, uses, flowering time, campus locations, or taxonomy.`;
  }

  if (matches(q, "identif", "diagnostic", "distinguish", "tell apart", "look like", "recognize", "recognise", "key feature", "how to spot")) {
    if (plant.diagnosticCharacters.length === 0) {
      return `Diagnostic characters for **${name}** (*${sci}*) have not been written up yet. From the survey:\n\n${surveyFacts(plant)}\n\nA good starting point in the field is the growth form — look for a ${plant.habit.toLowerCase()}.${noProfileNote(plant)}`;
    }
    return `To identify **${name}** (*${sci}*), look for these diagnostic characters:\n\n${formatDiagnostics(plant)}\n\nIt is a **${plant.type}** with habit: ${plant.habit}.${plant.height ? ` Typical height: ${plant.height}.` : ""}`;
  }

  if (matches(q, "medicin", "heal", "health", "remedy", "ayurved", "traditional medicine", "pharmac")) {
    const medicinal = plant.ethnobotany.filter(
      (e) => e.title.toLowerCase().includes("medic") || matches(e.text.toLowerCase(), "medic", "heal", "tonic", "antibact"),
    );
    if (medicinal.length === 0) {
      return plant.ethnobotany.length > 0
        ? `**${name}** is not recorded as a medicinal species in our catalogue. Documented uses:\n\n${formatEthnobotany(plant)}`
        : `We have no documented medicinal use for **${name}** in the campus catalogue.\n\n${surveyFacts(plant)}${noProfileNote(plant)}`;
    }
    return `**${name}** has documented ethnobotanical value:\n\n${medicinal.map((e) => `• **${e.title}:** ${e.text}`).join("\n")}\n\n⚠️ This is educational information from the UniFlora database — not medical advice. Consult a qualified practitioner before therapeutic use.`;
  }

  if (matches(q, "flower", "bloom", "blossom", "phenolog", "season", "when does it")) {
    if (!plant.phenology) {
      return `Flowering and fruiting times for **${name}** have not been recorded in our catalogue yet — the floristic survey captured habit and location rather than phenology.\n\n${surveyFacts(plant)}`;
    }
    const flowering = plant.phenology.floweringLabel || "Flowering period not fully documented.";
    const fruiting = plant.phenology.fruitingLabel;
    return `**${name}** phenology on campus:\n\n• **Flowering:** ${flowering}${fruiting ? `\n• **Fruiting:** ${fruiting}` : ""}\n\nPhenology varies year to year with rainfall and temperature.`;
  }

  if (matches(q, "fruit", "seed", "drupe", "pod", "berry")) {
    const fruitChar = plant.diagnosticCharacters.find((d) => matches(d.label.toLowerCase(), "fruit", "seed"));
    const fruiting = plant.phenology?.fruitingLabel;
    if (!fruitChar && !fruiting) {
      return `Fruit characters for **${name}** are not documented in our catalogue yet.\n\n${surveyFacts(plant)}`;
    }
    let answer = fruiting ? `**Fruiting:** ${fruiting}` : `**${name}** fruit:`;
    if (fruitChar) answer += `\n\n**Fruit character:** ${fruitChar.value}`;
    return answer;
  }

  if (matches(q, "leaf", "leaves", "foliage")) {
    const leaf = plant.diagnosticCharacters.find((d) => d.label.toLowerCase().includes("leaf"));
    if (leaf) return `**Leaf characters of ${name}:**\n\n• ${leaf.value}${plant.description[0] ? `\n\n${plant.description[0]}` : ""}`;
    return `Leaf characters for **${name}** are not documented yet.\n\n${surveyFacts(plant)}`;
  }

  if (matches(q, "bark", "stem", "trunk")) {
    const bark = plant.diagnosticCharacters.find((d) => matches(d.label.toLowerCase(), "bark", "stem"));
    if (bark) return `**Bark / stem:** ${bark.value}`;
    return `Bark characters are not documented for **${name}**.${plant.description[0] ? ` General description: ${plant.description[0]}` : `\n\n${surveyFacts(plant)}`}`;
  }

  if (matches(q, "campus", "map", "location", "where", "find", "grow", "planted", "avenue", "garden", "zone")) {
    if (plant.occurrences === 0) {
      return `**${name}** appears on the campus floristic list but was not pinned during the GPS mapping survey, so there are no map records for it yet.\n\nBrowse the [Campus Map](/map) to see the species that were mapped.`;
    }
    const zoneNote = plant.zones.length
      ? ` It is recorded in ${plant.zones.length} campus zone${plant.zones.length === 1 ? "" : "s"}.`
      : "";
    const habitatNote = plant.habitat ? ` Typical setting: **${plant.habitat}**.` : "";
    return `**${name}** has **${plant.occurrences} individual${plant.occurrences === 1 ? "" : "s"}** mapped by GPS on campus.${zoneNote}${habitatNote}\n\nOpen the [Campus Map](/map) to see every marker for this species.`;
  }

  if (matches(q, "habitat", "ecolog", "environment", "soil", "climate")) {
    if (plant.habitat) {
      return `On campus, **${name}** is typically found in: **${plant.habitat}**.\n\nIt is ${plant.growthStatus.toLowerCase()} here, growing as a ${plant.habit.toLowerCase()}.`;
    }
    return `A habitat note has not been written for **${name}** yet.\n\n${surveyFacts(plant)}`;
  }

  if (matches(q, "family", "taxon", "genus", "order", "relative", "classification", "related")) {
    let answer = `**Taxonomy of ${name}:**\n\n• **Family:** ${plant.family}\n• **Genus:** *${plant.genus}*`;
    if (plant.order) answer += `\n• **Order:** ${plant.order}`;
    if (family) {
      answer += `\n\n**${family.name} on campus:** ${family.speciesCount} species in ${family.generaCount} genera`;
      if (family.occurrences > 0) answer += `, ${family.occurrences} individuals mapped`;
      answer += ".";
      if (family.description) answer += `\n\n${family.description}`;
    }
    return answer;
  }

  if (matches(q, "use", "ethnobot", "cultural", "timber", "ornament", "food", "agricult", "economic", "purpose", "benefit")) {
    if (plant.ethnobotany.length === 0) {
      return `Uses for **${name}** have not been documented in the catalogue yet.\n\n${surveyFacts(plant)}${noProfileNote(plant)}`;
    }
    return `**Uses & ethnobotany of ${name}:**\n\n${formatEthnobotany(plant)}`;
  }

  if (matches(q, "height", "size", "tall", "canopy", "dimension", "mature")) {
    const parts = [`**Habit:** ${plant.habit}`, `**Type:** ${plant.type}`];
    if (plant.height) parts.splice(1, 0, `**Height:** ${plant.height}`);
    return parts.join("\n");
  }

  if (matches(q, "native", "exotic", "introduced", "invasive", "cultivated", "wild", "conserv", "iucn", "status", "endanger")) {
    let answer = `**${name}** is recorded as **${plant.growthStatus}** on campus.`;
    if (plant.nativeStatus) answer += ` Origin: **${plant.nativeStatus}**.`;
    if (plant.conservationStatus) answer += ` Conservation code: **${plant.conservationStatus}**.`;
    return answer;
  }

  if (matches(q, "reference", "source", "citation", "literature", "where did", "proof")) {
    if (plant.references.length === 0) {
      return `No literature references are attached to **${name}** yet. Its record comes from the university floristic survey.`;
    }
    return `**References for ${name}:**\n\n${plant.references.map((r) => `• ${r}`).join("\n")}`;
  }

  if (matches(q, "voucher", "herbarium", "specimen", "collector", "barcode")) {
    if (!plant.voucher) {
      return `No herbarium voucher is linked to **${name}** in the current catalogue. Browse [Collections](/collections) for digitised sheets.`;
    }
    const v = plant.voucher;
    return `**Herbarium voucher for ${name}:**\n\n• **Voucher:** ${v.number}\n• **Collector:** ${v.collector}\n• **Date:** ${v.date}\n• **Barcode:** ${v.barcode}`;
  }

  if (matches(q, "describe", "about", "what is", "tell me", "overview", "summary", "introduce", "information")) {
    if (plant.description.length === 0) {
      return `**${name}** (*${sci}*) is recorded in the campus flora as follows:\n\n${surveyFacts(plant)}${noProfileNote(plant)}`;
    }
    return `**${name}** (*${sci}*) belongs to **${plant.family}**.\n\n${plant.description.join("\n\n")}\n\n**Quick facts:** ${plant.type} · ${plant.growthStatus} · ${plant.lifeForm}`;
  }

  if (matches(q, "name", "called", "common", "local", "urdu", "vernacular")) {
    if (plant.localNames.length === 0) {
      return `No local or vernacular name is recorded for *${sci}* in the campus survey — it is listed under its scientific name only.`;
    }
    return `**Names for *${sci}*:**\n\n• **Local / common:** ${plant.localNames.join(", ")}`;
  }

  // Keyword overlap fallback across whatever text we do hold.
  const corpus = [
    ...plant.description,
    ...plant.ethnobotany.map((e) => `${e.title} ${e.text}`),
    ...plant.diagnosticCharacters.map((d) => `${d.label} ${d.value}`),
  ]
    .join(" ")
    .toLowerCase();

  const words = q.split(/\s+/).filter((w) => w.length > 3);
  if (corpus && words.filter((w) => corpus.includes(w)).length >= 2) {
    return `Based on our records for **${name}**:\n\n${plant.description.join(" ")}${
      plant.ethnobotany.length ? `\n\n**Uses:**\n${formatEthnobotany(plant)}` : ""
    }`;
  }

  return `I can help with **${name}** (*${sci}*) using UniFlora's campus data. Here is what we hold:\n\n${surveyFacts(plant)}\n\nTry asking about identification, flowering season, uses, campus locations, or taxonomy.`;
}

import type { Family, Plant } from "@/lib/data-types";

/** Serialize plant (+ optional family) data for the AI system prompt. */
export function buildPlantContext(plant: Plant, family?: Family): string {
  const lines: string[] = [
    `Scientific name: ${plant.scientificName}${plant.author ? ` ${plant.author}` : ""}`,
    `Common name: ${plant.commonName}`,
    ...(plant.localNames.length ? [`Local names: ${plant.localNames.join(", ")}`] : []),
    `Family: ${plant.family} | Genus: ${plant.genus}${plant.order ? ` | Order: ${plant.order}` : ""}`,
    `Growth form: ${plant.type} (habit: ${plant.habit}, life form: ${plant.lifeForm})`,
    `Status on campus: ${plant.growthStatus}`,
    ...(plant.height ? [`Height: ${plant.height}`] : []),
    ...(plant.habitat ? [`Habitat on campus: ${plant.habitat}`] : []),
    ...(plant.nativeStatus ? [`Origin: ${plant.nativeStatus}`] : []),
    ...(plant.conservationStatus ? [`Conservation: ${plant.conservationStatus}`] : []),
    ...(plant.medicinal ? ["Medicinal plant: yes"] : []),
    `Individuals mapped by GPS: ${plant.occurrences}`,
    ...(plant.zones.length ? [`Campus zones: ${plant.zones.join(", ")}`] : []),
  ];

  if (plant.description.length) {
    lines.push("", "Description:", ...plant.description.map((p) => `- ${p}`));
  }

  if (plant.diagnosticCharacters.length) {
    lines.push("", "Diagnostic characters:", ...plant.diagnosticCharacters.map((d) => `- ${d.label}: ${d.value}`));
  }

  if (plant.phenology) {
    lines.push("", `Phenology — ${plant.phenology.floweringLabel || "flowering period not recorded"}`);
    if (plant.phenology.fruitingLabel) lines.push(`Fruiting — ${plant.phenology.fruitingLabel}`);
  }

  if (plant.ethnobotany.length) {
    lines.push("", "Ethnobotany & uses:", ...plant.ethnobotany.map((e) => `- ${e.title}: ${e.text}`));
  }

  if (plant.references.length) {
    lines.push("", "References:", ...plant.references.map((r) => `- ${r}`));
  }

  if (plant.voucher) {
    lines.push(
      "",
      "Herbarium voucher:",
      `- Number: ${plant.voucher.number}`,
      `- Collector: ${plant.voucher.collector}`,
      `- Date: ${plant.voucher.date}`,
      `- Barcode: ${plant.voucher.barcode}`,
    );
  }

  if (!plant.description.length) {
    lines.push(
      "",
      "NOTE: No written botanical profile exists for this species yet. The facts above come from the",
      "university floristic survey. Do not invent description, phenology, uses or references — say what is",
      "recorded, and that fuller detail has not been added to the catalogue yet.",
    );
  }

  if (family) {
    lines.push(
      "",
      `Family overview (${family.name}):`,
      `- ${family.speciesCount} species in ${family.generaCount} genera recorded on campus`,
      `- ${family.occurrences} individuals mapped`,
      `- Growth habits present: ${family.habits.join(", ")}`,
      `- Cultivated: ${family.cultivated}, Wild: ${family.wild}`,
    );
    if (family.description) lines.push(family.description);
    if (family.characteristics.length) {
      lines.push("Family characteristics:", ...family.characteristics.map((c) => `- ${c}`));
    }
    if (family.distribution) lines.push(`Distribution: ${family.distribution}`);
  }

  return lines.join("\n");
}

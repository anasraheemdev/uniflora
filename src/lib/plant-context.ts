import type { Family } from "@/data/families";
import type { Plant } from "@/data/plants";

/** Serialize plant (+ optional family) data for the AI system prompt. */
export function buildPlantContext(plant: Plant, family?: Family): string {
  const lines: string[] = [
    `Scientific name: ${plant.scientificName}${plant.author ? ` ${plant.author}` : ""}`,
    `Common name: ${plant.commonName}`,
    ...(plant.commonNames?.length ? [`Other names: ${plant.commonNames.join(", ")}`] : []),
    ...(plant.localName ? [`Local name: ${plant.localName}`] : []),
    `Family: ${plant.family} | Genus: ${plant.genus} | Order: ${plant.order}`,
    `Plant type: ${plant.type}`,
    `Habit: ${plant.habit}`,
    ...(plant.height ? [`Height: ${plant.height}`] : []),
    `Habitat on campus: ${plant.habitat}`,
    `Native status: ${plant.nativeStatus}`,
    ...(plant.conservationStatus ? [`Conservation: ${plant.conservationStatus}`] : []),
    ...(plant.medicinal ? ["Medicinal plant: yes"] : []),
    `Mapped campus locations: ${plant.mapLocations}`,
    "",
    "Description:",
    ...plant.description.map((p) => `- ${p}`),
    "",
    "Diagnostic characters:",
    ...plant.diagnosticCharacters.map((d) => `- ${d.label}: ${d.value}`),
    "",
    `Phenology — ${plant.phenology.floweringLabel || "Flowering: see calendar"}`,
    ...(plant.phenology.fruitingLabel ? [`Fruiting — ${plant.phenology.fruitingLabel}`] : []),
    "",
    "Ethnobotany & uses:",
    ...plant.ethnobotany.map((e) => `- ${e.title}: ${e.text}`),
    "",
    "References:",
    ...plant.references.map((r) => `- ${r}`),
  ];

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

  if (family) {
    lines.push(
      "",
      `Family overview (${family.name}):`,
      family.description,
      "Family characteristics:",
      ...family.characteristics.map((c) => `- ${c}`),
      `Distribution: ${family.distribution}`,
      `Campus notes: ${family.campusNotes}`,
    );
  }

  return lines.join("\n");
}

/**
 * Photographs currently held for campus species.
 *
 * Only a handful of the 355 surveyed species have been photographed so far, so
 * `getPlantImage` returns null rather than a stand-in picture — showing one
 * species' photo on another's page would be a data-integrity problem.
 */
export const PLANT_IMAGES: Record<string, string> = {
  "azadirachta-indica": "/plants/azadirachta-indica.jpg",
  "bougainvillea-glabra": "/plants/bougainvillea-glabra.jpg",
  "cassia-fistula": "/plants/cassia-fistula.jpg",
  "delonix-regia": "/plants/delonix-regia.jpg",
  "ficus-religiosa": "/plants/ficus-religiosa.jpg",
  "jasminum-sambac": "/plants/jasminum-sambac.jpg",
  "nerium-oleander": "/plants/nerium-oleander.jpg",
  "pongamia-pinnata": "/plants/pongamia-pinnata.jpg",
  "vachellia-nilotica": "/plants/vachellia-nilotica.jpg",
};

export const HERO_IMAGE = "/hero.jpg";
export const FIELD_GUIDE_IMAGE = "/field-guide.jpg";
export const QR_CODE_IMAGE = "/qr.jpeg";

export function getPlantImage(slug: string): string | null {
  return PLANT_IMAGES[slug] ?? null;
}

export function hasPlantImage(slug: string): boolean {
  return slug in PLANT_IMAGES;
}

export const PHOTOGRAPHED_SPECIES = Object.keys(PLANT_IMAGES).length;

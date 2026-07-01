/** Local plant images sourced from Wikipedia / Wikimedia Commons (open license). */
export const PLANT_IMAGES: Record<string, string> = {
  "azadirachta-indica": "/plants/azadirachta-indica.jpg",
  "bougainvillea-glabra": "/plants/bougainvillea-glabra.jpg",
  "ficus-religiosa": "/plants/ficus-religiosa.jpg",
  "cassia-fistula": "/plants/cassia-fistula.jpg",
  "calliandra-haematocephala": "/plants/calliandra-haematocephala.jpg",
  "pongamia-pinnata": "/plants/pongamia-pinnata.jpg",
  "acacia-nilotica": "/plants/acacia-nilotica.jpg",
  "nerium-oleander": "/plants/nerium-oleander.jpg",
  "delonix-regia": "/plants/delonix-regia.jpg",
  "jasminum-sambac": "/plants/jasminum-sambac.jpg",
  "ocimum-tenuiflorum": "/plants/ocimum-tenuiflorum.jpg",
  "terminalia-arjuna": "/plants/terminalia-arjuna.jpg",
};

export const HERO_IMAGE = "/hero.jpg";
export const FIELD_GUIDE_IMAGE = "/field-guide.jpg";
export const QR_CODE_IMAGE = "/qr.jpeg";

export function getPlantImage(slug: string): string {
  return PLANT_IMAGES[slug] ?? "/plants/azadirachta-indica.jpg";
}

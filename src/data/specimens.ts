/**
 * Herbarium voucher records.
 *
 * The campus herbarium has not been digitised yet. When the sheets are
 * catalogued, fill `data-templates/specimens.csv` and load it here — every
 * consumer reads through the helpers below, so the pages light up on their own.
 */

export type Specimen = {
  slug: string;
  scientificName: string;
  family: string;
  voucher: string;
  collector: string;
  year: string;
};

export const SPECIMENS: Specimen[] = [];

export const SPECIMEN_STATS = {
  vouchers: SPECIMENS.length,
  collectors: new Set(SPECIMENS.map((s) => s.collector)).size,
};

export function getSpecimensBySlug(slug: string): Specimen[] {
  return SPECIMENS.filter((s) => s.slug === slug);
}

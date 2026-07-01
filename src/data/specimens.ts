export type Specimen = {
  slug: string;
  scientificName: string;
  family: string;
  voucher: string;
  collector: string;
  year: string;
};

export const SPECIMENS: Specimen[] = [
  { slug: "azadirachta-indica", scientificName: "Azadirachta indica", family: "Meliaceae", voucher: "UF-HB-0412", collector: "A. Rehman", year: "2025" },
  { slug: "ficus-religiosa", scientificName: "Ficus religiosa", family: "Moraceae", voucher: "UF-HB-0388", collector: "S. Iqbal", year: "2024" },
  { slug: "cassia-fistula", scientificName: "Cassia fistula", family: "Fabaceae", voucher: "UF-HB-0361", collector: "M. Zahra", year: "2024" },
  { slug: "bougainvillea-glabra", scientificName: "Bougainvillea glabra", family: "Nyctaginaceae", voucher: "UF-HB-0344", collector: "A. Rehman", year: "2023" },
  { slug: "delonix-regia", scientificName: "Delonix regia", family: "Fabaceae", voucher: "UF-HB-0319", collector: "S. Iqbal", year: "2023" },
  { slug: "pongamia-pinnata", scientificName: "Pongamia pinnata", family: "Fabaceae", voucher: "UF-HB-0298", collector: "M. Zahra", year: "2022" },
  { slug: "terminalia-arjuna", scientificName: "Terminalia arjuna", family: "Combretaceae", voucher: "UF-HB-0276", collector: "A. Rehman", year: "2022" },
  { slug: "ocimum-tenuiflorum", scientificName: "Ocimum tenuiflorum", family: "Lamiaceae", voucher: "UF-HB-0255", collector: "S. Iqbal", year: "2021" },
];

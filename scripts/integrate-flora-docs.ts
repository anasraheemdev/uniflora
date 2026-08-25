/**
 * One-time content integration: the professor's per-species and per-family
 * write-ups (docx files, parsed + cleaned by a Python pass into JSON
 * payloads) get merged into `species_profiles` and `families`.
 *
 * Inputs are the two JSON payloads built by
 * scripts/support/build_payloads.py from the parsed docx text — see that
 * script for how synonyms/distribution/diagnostics/phenology/ethnobotany
 * were extracted and how Pakistani province/city names were stripped from
 * distribution text per the professor's instruction.
 *
 * Safe to re-run: every write is an upsert/update keyed on the species
 * slug or family slug already in the database.
 *
 * Usage:
 *   npx tsx scripts/integrate-flora-docs.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const PAYLOAD_DIR =
  "C:\\Users\\ANASRA~1\\AppData\\Local\\Temp\\claude\\C--Users-Anas-Raheem-Downloads-uniflora\\9775385a-84b1-4113-800f-676464fd9679\\scratchpad\\docx_text";

type SpeciesPayload = {
  slug: string;
  sciFull: string;
  synonyms: string[];
  description: string[];
  diagnosticCharacters: { label: string; value: string }[];
  nativeRange: string | null;
  introducedRange: string | null;
  regionalDistribution: string | null;
  habitat: string | null;
  ethnobotany: { title: string; text: string }[];
  medicinal: boolean;
  phenology: { flowering: number[]; fruiting: number[]; floweringLabel: string | null; fruitingLabel: string | null } | null;
  conservationStatus: string | null;
  taxonomicNotes: string | null;
  nativeStatus: "Native" | "Exotic";
  height: string | null;
};

type FamilyPayload = {
  slug: string;
  familyFull: string;
  commonName: string | null;
  description: string | null;
  characteristics: string[];
  distribution: string | null;
  economicUses: string[];
};

async function main() {
  const speciesPayload: SpeciesPayload[] = JSON.parse(fs.readFileSync(`${PAYLOAD_DIR}\\species_payload.json`, "utf-8"));
  const familyPayload: FamilyPayload[] = JSON.parse(fs.readFileSync(`${PAYLOAD_DIR}\\family_payload.json`, "utf-8"));

  console.log(`Loaded ${speciesPayload.length} species records, ${familyPayload.length} family records.`);

  // Resolve species slug -> id
  const { data: speciesRows, error: speciesErr } = await supabase.from("species").select("id, slug");
  if (speciesErr) throw speciesErr;
  const idBySlug = new Map(speciesRows.map((r) => [r.slug, r.id]));

  let speciesOk = 0;
  let speciesFail = 0;
  for (const p of speciesPayload) {
    const speciesId = idBySlug.get(p.slug);
    if (!speciesId) {
      console.warn(`  ! no species row for slug ${p.slug} (${p.sciFull})`);
      speciesFail++;
      continue;
    }
    const { error } = await supabase.from("species_profiles").upsert(
      {
        species_id: speciesId,
        synonyms: p.synonyms,
        description: p.description,
        diagnostic_characters: p.diagnosticCharacters,
        native_range: p.nativeRange,
        introduced_range: p.introducedRange,
        regional_distribution: p.regionalDistribution,
        habitat: p.habitat,
        ethnobotany: p.ethnobotany,
        medicinal: p.medicinal,
        phenology: p.phenology,
        conservation_status: p.conservationStatus,
        taxonomic_notes: p.taxonomicNotes,
        native_status: p.nativeStatus,
        height: p.height,
      },
      { onConflict: "species_id" },
    );
    if (error) {
      console.error(`  ! species_profiles upsert failed for ${p.slug}: ${error.message}`);
      speciesFail++;
    } else {
      speciesOk++;
    }
  }
  console.log(`species_profiles: ${speciesOk} upserted, ${speciesFail} failed`);

  let famOk = 0;
  let famFail = 0;
  for (const f of familyPayload) {
    const { error } = await supabase
      .from("families")
      .update({
        description: f.description,
        characteristics: f.characteristics,
        distribution: f.distribution,
        economic_uses: f.economicUses,
        ...(f.commonName ? { common_name: f.commonName } : {}),
      })
      .eq("slug", f.slug);
    if (error) {
      console.error(`  ! families update failed for ${f.slug}: ${error.message}`);
      famFail++;
    } else {
      famOk++;
    }
  }
  console.log(`families: ${famOk} updated, ${famFail} failed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

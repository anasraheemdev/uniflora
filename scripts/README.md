# Flora data pipeline

The species catalogue and campus map are generated from the botany department's
survey files. Nothing in `src/data/generated/` should be edited by hand — re-run
the importer instead.

## Running the import

```bash
npm run import:flora     # regenerate src/data/generated/
npm run verify:flora     # sanity-check the decoded markers
```

The importer defaults to the two files in `~/Downloads`. Point it elsewhere with:

```bash
python scripts/import_flora_data.py \
  --xlsx "path/to/Floristic list of Uniflora.xlsx" \
  --csv  "path/to/map_locations.csv" \
  --zones 5
```

Requires Python 3 with `openpyxl` (`pip install openpyxl`).

## Inputs

| File | Contents |
| --- | --- |
| `Floristic list of Uniflora_*.xlsx` | Sheet1: family, species, local name, cultivated/wild, habit, life form. Family is merged across rows, so it carries down until the next value. |
| `map_locations*.csv` | One row per individual plant: scientific name plus latitude/longitude in `D M S` form. Windows-1252 encoded. |

## Outputs

| File | Purpose |
| --- | --- |
| `families.json` | 81 families with genera, species counts and habit mix |
| `species.json` | 355 species with taxonomy, habit, status and occurrence counts |
| `markers.json` | GPS records, index-encoded as integer offsets (~67 KB instead of ~324 KB) |
| `campus.json` | Map centre, bounds and the derived zone polygons |
| `import-report.json` | Everything the importer changed or rejected — read this after each run |

## How messy input is handled

The survey is field data, so the importer repairs what it can prove and reports
the rest rather than guessing:

- **Encoding.** The CSV is Windows-1252; non-breaking spaces inside names are
  normalised (this is what turned `Melia azedarach L.` into `Melia azedarach?L.`).
- **Run-together coordinates.** `7240 51` becomes `72 40 51`, and `32 427`
  becomes `32 4 27`.
- **Impossible degrees.** A longitude typed as `74 40 55` or `32 40 57` is
  corrected to `72`, since no other degree can occur on this campus.
- **Seconds of 60** roll into the next minute.
- **Off-campus fixes are dropped, not guessed.** Ten records read `72 54 53`
  where their neighbours read `72 40 53`; they land ~22 km away, so they are
  rejected and listed under `rejectedOffCampusFixes` for the surveyor to confirm.
- **Unmatched names are dropped and listed** under `nameResolution`. A field name
  is matched to the floristic list by binomial, falling back to genus only when
  that genus has exactly one species in the list.

## Known gaps for the next data hand-off

`import-report.json` currently flags:

- `Ficus binnendykii`, `Ficus amplissima`, `Cestrum small ?` and `Pyrus ?` were
  mapped but are absent from the floristic list (18 records).
- Ten `72 54 53` coordinates need confirming.
- 165 of the 355 species have no GPS records — expected, since the mapping pass
  concentrated on trees and shrubs.

## Basemap zoom limits

`node scripts/probe_tiles.mjs` reports which zoom levels each tile provider
actually has imagery for over the campus. As of the last check:

- **Esri World Imagery** — real imagery to z18. At z19+ every tile is the same
  2,521-byte "Map data not yet available" placeholder.
- **OpenStreetMap** — real tiles to z19; z20+ returns HTTP 400.

These drive `maxNativeZoom` in `MapExplorer`, so Leaflet upscales the deepest
real tile rather than showing blank or placeholder tiles. Re-run the probe if the
map ever goes grey when zoomed in — providers do extend coverage over time.

## Display note

Field GPS is recorded to the nearest arc-second (~31 m), so many plants share a
coordinate. The importer spreads co-located records over a few metres using a
deterministic golden-angle spiral, which keeps every individual clickable
without implying more precision than the source has.

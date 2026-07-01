# UniFlora — Campus Flora Information System

Next.js application for documenting, mapping, learning about, and conserving campus plant diversity.

## Phase 1 (current)

- Full UI converted from HTML mockups with **pixel-faithful** inline styles
- Static mock data in `src/data/` (no database yet)
- Plant card images from **Wikimedia Commons** (open source)
- Pages: Home, Explore, Species detail, Families, Map, Collections, Gallery, Learn, About, Contact, Admin

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Phase 2 (planned)

- PostgreSQL + PostGIS database
- REST/GraphQL API layer (`src/lib/data.ts` is the swap point)
- Leaflet + OpenStreetMap for live GIS map
- Authentication and admin dashboard backend
- User-uploaded campus photos

## Original mockups

The `.dc.html` files in the project root are the original design references and are preserved unchanged.

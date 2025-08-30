// build/generate-manifest.mjs
import { promises as fs } from "node:fs";
import { join } from "node:path";

const DATA_DIR = "data/countries";
const MANIFEST_PATH = "data/manifest.json";

function safeNum(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }

async function main(){
  const files = await fs.readdir(DATA_DIR);
  const countries = [];
  let maxPop = 1, maxArea = 1, maxHigh = 1;

  for (const f of files){
    if (!f.toLowerCase().endsWith(".json")) continue;
    const code = f.replace(/\.json$/i, "").toUpperCase();
    const raw = await fs.readFile(join(DATA_DIR, f), "utf-8");
    const obj = JSON.parse(raw);

    countries.push({ code, name: obj.name || code });

    maxPop  = Math.max(maxPop,  safeNum(obj.population));
    maxArea = Math.max(maxArea, safeNum(obj.area_km2));
    maxHigh = Math.max(maxHigh, safeNum(obj.highest_point_m));
  }

  // sort alphabetically by name for a tidy index
  countries.sort((a,b)=>a.name.localeCompare(b.name));

  const manifest = {
    max: {
      population: maxPop,
      area_km2: maxArea,
      highest_point_m: maxHigh
    },
    countries
  };

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${MANIFEST_PATH} with ${countries.length} countries.`);
}

main().catch(err => { console.error(err); process.exit(1); });

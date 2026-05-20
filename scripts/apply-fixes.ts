import fs from 'fs';
import path from 'path';

const ITINERARY_REPORT_FILE = path.join(__dirname, '../src/data/itinerary-audit-report.json');
const POI_REPORT_FILE = path.join(__dirname, '../src/data/poi-audit-report.json');
const ITINERARY_GEO_FILE = path.join(__dirname, '../src/data/itinerary-geo.ts');
const NEARBY_POIS_FILE = path.join(__dirname, '../src/data/nearby-pois.ts');

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const SAFE_FAR_OFF_POIS = [
  'Bebek Tebasari Resto (Ubud Traditional Food)',
  'Bebek Tebasari Resto',
  'Satria Coffee Plantation (Agrowisata Organik)',
  'Cantik Agriculture (Sunset Coffee Testing)',
  'Akasa Specialty Coffee (Ngopi Atas Awan & View Batur)',
  'Cepung Cave Sunlight Ray Spot',
  'Warung Cepung (Kuliner Lokal)',
  'Handara Golf Resort Cliff Resto',
  'Wanagiri Hidden Hills (Ayunan Danau & Spot Foto)',
  'Taman Kupu-Kupu Kemenuh (Konservasi & Wisata)'
];

function applyItineraryFixes() {
  if (!fs.existsSync(ITINERARY_REPORT_FILE)) {
    console.error("Itinerary report file not found.");
    return;
  }

  const report = JSON.parse(fs.readFileSync(ITINERARY_REPORT_FILE, 'utf-8'));
  let geoContent = fs.readFileSync(ITINERARY_GEO_FILE, 'utf-8');
  let updatedCount = 0;

  console.log("Applying fixes to itinerary-geo.ts...");

  for (const entry of report) {
    if (!entry.googleCoords) continue;

    const stopName = entry.stopName;
    const newCoords = entry.googleCoords;

    // Build regex to match: name: 'Stop Name', coordinates: [lat, lng]
    // Allowing both single and double quotes, and escaped quotes.
    const escapedName = escapeRegExp(stopName).replace(/'/g, "(?:'|\\\\')");
    const regex = new RegExp(
      `(name:\\s*['"]${escapedName}['"],\\s*coordinates:\\s*\\[)[^\\]]+(\\])`
    );

    if (regex.test(geoContent)) {
      geoContent = geoContent.replace(
        regex,
        `$1${newCoords[0].toFixed(4)}, ${newCoords[1].toFixed(4)}$2`
      );
      console.log(`  Updated stop: "${stopName}" → [${newCoords[0].toFixed(4)}, ${newCoords[1].toFixed(4)}]`);
      updatedCount++;
    } else {
      console.warn(`  ⚠ Could not find stop: "${stopName}" in itinerary-geo.ts`);
    }
  }

  fs.writeFileSync(ITINERARY_GEO_FILE, geoContent, 'utf-8');
  console.log(`✅ Successfully updated ${updatedCount} stops in itinerary-geo.ts.\n`);
}

function applyPoiFixes() {
  if (!fs.existsSync(POI_REPORT_FILE)) {
    console.error("POI report file not found.");
    return;
  }

  const report = JSON.parse(fs.readFileSync(POI_REPORT_FILE, 'utf-8'));
  let poiContent = fs.readFileSync(NEARBY_POIS_FILE, 'utf-8');
  let updatedCount = 0;

  console.log("Applying fixes to nearby-pois.ts...");

  for (const entry of report) {
    if (!entry.googleCoords) continue;

    const isMatch = entry.status === '✅ MATCH';
    const isDrift = entry.status === '⚠️ DRIFT';
    const isSafeFarOff = SAFE_FAR_OFF_POIS.includes(entry.poiName);

    if (!isMatch && !isDrift && !isSafeFarOff) {
      console.log(`  Skipping unsafe far-off POI: "${entry.poiName}" (${entry.distanceMeters}m off)`);
      continue;
    }

    const poiName = entry.poiName;
    const newCoords = entry.googleCoords;

    // In nearby-pois.ts, the coordinates: [...] is on a separate line below name.
    // We search for the POI name block, and then find the coordinates inside it.
    const escapedName = escapeRegExp(poiName).replace(/'/g, "(?:'|\\\\')");
    
    // We match the name line and anything up to coordinates
    const regex = new RegExp(
      `(name:\\s*['"]${escapedName}['"],[\\s\\S]*?coordinates:\\s*\\[)[^\\]]+(\\])`
    );

    if (regex.test(poiContent)) {
      poiContent = poiContent.replace(
        regex,
        `$1${newCoords[0].toFixed(4)}, ${newCoords[1].toFixed(4)}$2`
      );
      console.log(`  Updated POI: "${poiName}" → [${newCoords[0].toFixed(4)}, ${newCoords[1].toFixed(4)}]`);
      updatedCount++;
    } else {
      console.warn(`  ⚠ Could not find POI: "${poiName}" in nearby-pois.ts`);
    }
  }

  fs.writeFileSync(NEARBY_POIS_FILE, poiContent, 'utf-8');
  console.log(`✅ Successfully updated ${updatedCount} POIs in nearby-pois.ts.\n`);
}

function run() {
  applyItineraryFixes();
  applyPoiFixes();
}

run();

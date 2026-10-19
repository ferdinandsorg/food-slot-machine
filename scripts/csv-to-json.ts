/**
 * Converts data/foods.csv → src/data/foods.json
 * Run: npx tsx scripts/csv-to-json.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(__dirname, '..');
const CSV_PATH = resolve(ROOT, 'data/foods.csv');
const JSON_PATH = resolve(ROOT, 'src/data/foods.json');

function parseCsv(text: string): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map((line) => {
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
        continue;
      }
      current += ch;
    }
    cells.push(current.trim());
    return cells;
  });
}

const rows = parseCsv(readFileSync(CSV_PATH, 'utf8'));
const [header, ...body] = rows;
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

const foods = body
  .filter((row) => row.length >= 6 && row[idx.id])
  .map((row) => ({
    id: row[idx.id],
    name: row[idx.name],
    category: row[idx.category],
    imageKey: row[idx.image_key],
    tags: row[idx.tags]
      ? row[idx.tags].split(';').map((t) => t.trim()).filter(Boolean)
      : [],
    enabled: row[idx.enabled]?.toLowerCase() === 'true',
  }));

writeFileSync(JSON_PATH, `${JSON.stringify(foods, null, 2)}\n`, 'utf8');
console.log(`Wrote ${foods.length} foods to ${JSON_PATH}`);

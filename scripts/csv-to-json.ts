/**
 * Converts data/foods.csv → src/data/foods.json
 *      and data/avoid-pairs.csv → src/data/avoidPairs.json
 * Run: npx tsx scripts/csv-to-json.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { PAIR_STATUSES, readAvoidRows, writeAvoidJson } from './avoid-pairs';

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

function list(cell: string | undefined): string[] {
  return cell
    ? cell
        .split(';')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
}

function fail(message: string): never {
  console.error(`✖ ${message}`);
  process.exit(1);
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
    // Unicode emoji, rendered by the system (Apple emoji on iOS). Empty = use imageKey art.
    ...(row[idx.emoji] ? { emoji: row[idx.emoji] } : {}),
    tags: list(row[idx.tags]),
    enabled: row[idx.enabled]?.toLowerCase() === 'true',
  }));

const byId = new Map(foods.map((f) => [f.id, f]));
const avoidRows = readAvoidRows();
for (const { a, b, status } of avoidRows) {
  const fa = byId.get(a);
  const fb = byId.get(b);
  if (!fa || !fb) fail(`avoid-pairs.csv: unbekannte Zutat in "${a},${b}".`);
  if (fa.category === fb.category) {
    fail(`avoid-pairs.csv: "${a},${b}" liegen auf derselben Walze und treffen nie aufeinander.`);
  }
  if (!(PAIR_STATUSES as readonly string[]).includes(status)) {
    fail(`avoid-pairs.csv: Status "${status}" bei "${a},${b}". Erlaubt: leer, bestätigt, erlaubt`);
  }
}

writeFileSync(JSON_PATH, `${JSON.stringify(foods, null, 2)}\n`, 'utf8');
const avoided = writeAvoidJson(avoidRows);
console.log(`Wrote ${foods.length} foods to ${JSON_PATH}`);
console.log(`Wrote ${avoided} avoid pairs (${avoidRows.length - avoided} marked erlaubt)`);

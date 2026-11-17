/**
 * data/avoid-pairs.csv lists pairs that shouldn't land together. The owner
 * judges each one in the review tool: `status` becomes "bestätigt" (stays out)
 * or "erlaubt" (fits after all). Every row that isn't "erlaubt" is written to
 * src/data/avoidPairs.json, which the app filters by.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(__dirname, '..');
export const PAIRS_CSV_PATH = resolve(ROOT, 'data/avoid-pairs.csv');
const PAIRS_JSON_PATH = resolve(ROOT, 'src/data/avoidPairs.json');
const HEADER = 'a,b,reason,status';

export const PAIR_STATUSES = ['', 'bestätigt', 'erlaubt'] as const;
export type PairStatus = (typeof PAIR_STATUSES)[number];
export type AvoidRow = { a: string; b: string; reason: string; status: PairStatus };

export function readAvoidRows(): AvoidRow[] {
  const [, ...lines] = readFileSync(PAIRS_CSV_PATH, 'utf8').trim().split(/\r?\n/);
  return lines
    .filter(Boolean)
    .map((line) => {
      const [a, b, reason = '', status = ''] = line.split(',').map((c) => c.trim());
      return { a, b, reason, status: status as PairStatus };
    });
}

export function writeAvoidRows(rows: AvoidRow[]): void {
  const body = rows.map((r) => [r.a, r.b, r.reason, r.status].join(','));
  writeFileSync(PAIRS_CSV_PATH, `${[HEADER, ...body].join('\n')}\n`, 'utf8');
  writeAvoidJson(rows);
}

/** Writes the pairs the app avoids; returns how many. */
export function writeAvoidJson(rows: AvoidRow[]): number {
  const pairs = rows.filter((r) => r.status !== 'erlaubt').map((r) => [r.a, r.b]);
  writeFileSync(PAIRS_JSON_PATH, `${JSON.stringify(pairs)}\n`, 'utf8');
  return pairs.length;
}

export function setPairStatus(a: string, b: string, status: PairStatus): void {
  writeAvoidRows(readAvoidRows().map((r) => (r.a === a && r.b === b ? { ...r, status } : r)));
}

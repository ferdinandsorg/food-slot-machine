/**
 * Swipe tool for data/avoid-pairs.csv. Each card shows one drafted pair in a
 * full meal; "geht" marks it erlaubt, "geht nicht" bestätigt — written straight
 * into the CSV and src/data/avoidPairs.json.
 * Run: npm run data:review  →  http://localhost:4321
 */
import { createReadStream, existsSync, readFileSync } from 'node:fs';
import { createServer, type ServerResponse } from 'node:http';
import { resolve } from 'node:path';

import { getFoodById, getFoodsByCategory } from '@/src/data/loadFoods';
import type { Food, FoodCategory } from '@/src/data/types';
import { SLOT_ORDER } from '@/src/data/types';

import { readAvoidRows, setPairStatus, type AvoidRow, type PairStatus } from './avoid-pairs';

const PORT = 4321;
const ROOT = resolve(__dirname, '..');
const PAGE = resolve(__dirname, 'review/index.html');
const IMAGES = resolve(ROOT, 'assets/foods/atlas');
const FONT = resolve(ROOT, 'assets/fonts/UncutSans-Variable.ttf');

/** Pairs judged in this session, newest last, for undo. */
const history: AvoidRow[] = [];

const card = (f: Food) => ({ id: f.id, name: f.name, emoji: f.emoji ?? null, image: f.imageKey });

function randomFood(category: FoodCategory): Food {
  const pool = getFoodsByCategory(category);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** The pair's two foods on their reels, plus a random food on the third reel for context. */
function meal(row: AvoidRow) {
  const pair = [getFoodById(row.a)!, getFoodById(row.b)!];
  return Object.fromEntries(
    SLOT_ORDER.map((category) => {
      const food = pair.find((f) => f.category === category) ?? randomFood(category);
      return [category, { ...card(food), inPair: pair.includes(food) }];
    }),
  );
}

/** The next unjudged pair, or `pick` (the pair just undone). */
function next(pick?: AvoidRow) {
  const rows = readAvoidRows();
  const open = rows.filter((r) => r.status === '');
  const counts = { open: open.length, total: rows.length, reviewed: rows.length - open.length };
  const row = open.find((r) => pick && r.a === pick.a && r.b === pick.b) ?? open[0];
  if (!row) return { pair: null, ...counts };
  return { pair: { a: row.a, b: row.b }, meal: meal(row), reasons: [row.reason], ...counts };
}

function json(res: ServerResponse, body: unknown) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(readFileSync(PAGE));
    return;
  }

  if (url.pathname === '/api/next') return json(res, next());

  if (url.pathname === '/api/verdict' && req.method === 'POST') {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      const { a, b, verdict } = JSON.parse(raw) as Record<string, string>;
      const row = readAvoidRows().find((r) => r.a === a && r.b === b);
      if (!row || (verdict !== 'ja' && verdict !== 'nein')) {
        res.writeHead(400).end();
        return;
      }
      const status: PairStatus = verdict === 'ja' ? 'erlaubt' : 'bestätigt';
      setPairStatus(a, b, status);
      history.push(row);
      json(res, next());
    });
    return;
  }

  if (url.pathname === '/api/undo' && req.method === 'POST') {
    const last = history.pop();
    if (last) setPairStatus(last.a, last.b, '');
    return json(res, next(last));
  }

  if (url.pathname === '/font.ttf') {
    res.writeHead(200, { 'Content-Type': 'font/ttf' });
    createReadStream(FONT).pipe(res);
    return;
  }

  const image = url.pathname.match(/^\/img\/([a-z_]+)\.webp$/);
  if (image && existsSync(resolve(IMAGES, `${image[1]}.webp`))) {
    res.writeHead(200, { 'Content-Type': 'image/webp' });
    createReadStream(resolve(IMAGES, `${image[1]}.webp`)).pipe(res);
    return;
  }

  res.writeHead(404).end();
}).listen(PORT, () => {
  const open = readAvoidRows().filter((r) => r.status === '').length;
  console.log(`Bewertungs-Tool: http://localhost:${PORT}  (${open} offene Paare)`);
});

import assert from 'node:assert/strict';
import { pickFood, pickMeal } from './selectFoods';

function run() {
  const meal = pickMeal();
  assert.equal(meal.protein.category, 'protein');
  assert.equal(meal.carbs.category, 'carbs');
  assert.equal(meal.fiber.category, 'fiber');
  assert.equal(meal.carbs.enabled, true);

  const again = pickMeal(meal);
  // Soft variety: prefer a different id when pool allows it.
  assert.notEqual(again.protein.id, meal.protein.id);
  assert.notEqual(again.carbs.id, meal.carbs.id);
  assert.notEqual(again.fiber.id, meal.fiber.id);

  // Locked slots keep their food, unlocked ones change.
  const held = pickMeal(meal, { carbs: true });
  assert.equal(held.carbs.id, meal.carbs.id);
  assert.notEqual(held.protein.id, meal.protein.id);
  assert.notEqual(held.fiber.id, meal.fiber.id);

  const allHeld = pickMeal(meal, { protein: true, carbs: true, fiber: true });
  assert.deepEqual(allHeld, meal);

  const carbs = pickFood('carbs');
  assert.equal(carbs.category, 'carbs');

  console.log('selectFoods.test.ts: ok');
}

run();

import assert from 'node:assert/strict';
import { pickFood, pickMeal, pickSingleSlot } from './selectFoods';

function run() {
  const meal = pickMeal();
  assert.equal(meal.carbs.category, 'carbs');
  assert.equal(meal.protein.category, 'protein');
  assert.equal(meal.veg.category, 'veg');
  assert.equal(meal.carbs.enabled, true);

  const again = pickMeal(meal);
  // Soft variety: prefer a different id when pool allows it.
  assert.notEqual(again.carbs.id, meal.carbs.id);
  assert.notEqual(again.protein.id, meal.protein.id);
  assert.notEqual(again.veg.id, meal.veg.id);

  const respin = pickSingleSlot('protein', meal);
  assert.equal(respin.carbs.id, meal.carbs.id);
  assert.equal(respin.veg.id, meal.veg.id);
  assert.notEqual(respin.protein.id, meal.protein.id);

  const carbs = pickFood('carbs');
  assert.equal(carbs.category, 'carbs');

  console.log('selectFoods.test.ts: ok');
}

run();

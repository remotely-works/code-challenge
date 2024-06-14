import { RuleSet, Options } from './opts.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';

test('depends a a', () => {
  const s = new RuleSet();
  s.addDep('a', 'a');
  assert.equal(s.isCoherent(), true);
});

test('depends ab ba', () => {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addDep('b', 'a');
  assert.equal(s.isCoherent(), true);
});

test('exclusive a b', () => {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addConflict('a', 'b');
  assert.equal(s.isCoherent(), false);
});

test('exclusive ab bc', () => {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addDep('b', 'c');
  s.addConflict('a', 'c');
  assert.equal(s.isCoherent(), false);
});

test('deep deps', () => {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addDep('b', 'c');
  s.addDep('c', 'd');
  s.addDep('d', 'e');
  s.addDep('a', 'f');
  s.addConflict('e', 'f');
  assert.equal(s.isCoherent(), false);
});

test('exclusive ab bc ca de', () => {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addDep('b', 'c');
  s.addDep('c', 'a');
  s.addDep('d', 'e');
  s.addConflict('c', 'e');
  assert.equal(s.isCoherent(), true);

  const selected = new Options(s);

  selected.toggle('a');
  assert.deepEqual(selected.asArray().toSorted(), ['a', 'b', 'c']);

  s.addDep('f', 'f');
  selected.toggle('f');
  assert.deepEqual(selected.asArray().toSorted(), ['a', 'b', 'c', 'f']);

  selected.toggle('e');
  assert.deepEqual(selected.asArray().toSorted(), ['e', 'f']);

  selected.toggle('b');
  assert.deepEqual(selected.asArray().toSorted(), ['a', 'b', 'c', 'f']);

  s.addDep('b', 'g');
  selected.toggle('g');
  selected.toggle('b');
  assert.deepEqual(selected.asArray().toSorted(), ['f', 'g']);
});

test('ab bc toggle', () => {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addDep('b', 'c');
  const selected = new Options(s);
  selected.toggle('c');
  assert.deepEqual(selected.asArray(), ['c']);
});

test('ab ac multiple dependencies and exclusions', () => {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addDep('a', 'c');
  s.addConflict('b', 'd');
  s.addConflict('b', 'e');
  assert.equal(s.isCoherent(), true);

  const selected = new Options(s);
  selected.toggle('d');
  selected.toggle('e');
  selected.toggle('a');
  assert.deepEqual(selected.asArray().toSorted(), ['a', 'b', 'c']);
});

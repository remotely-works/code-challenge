import { RuleSet, Options } from './opts.mjs';

function testDependsAA() {
  const s = new RuleSet();
  s.addDep('a', 'a');
  if (!s.isCoherent()) {
    fail('testDependsAA s.isCoherent failed');
  }
}

function testDependsAB_BA() {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addDep('b', 'a');
  if (!s.isCoherent()) {
    fail('testDependsAB_BA s.isCoherent failed');
  }
}

function testExclusiveAB() {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addConflict('a', 'b');
  if (s.isCoherent()) {
    fail('testExclusiveAB s.isCoherent failed');
  }
}

function testExclusiveAB_BC() {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addDep('b', 'c');
  s.addConflict('a', 'c');
  if (s.isCoherent()) {
    fail('testExclusiveAB_BC s.isCoherent failed');
  }
}

function testDeepDeps() {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addDep('b', 'c');
  s.addDep('c', 'd');
  s.addDep('d', 'e');
  s.addDep('a', 'f');
  s.addConflict('e', 'f');

  if (s.isCoherent()) {
    fail('testDeepDeps s.isCoherent failed');
  }
}

function testExclusiveAB_BC_CA_DE() {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addDep('b', 'c');
  s.addDep('c', 'a');
  s.addDep('d', 'e');
  s.addConflict('c', 'e');
  if (!s.isCoherent()) {
    fail('testExclusiveAB_BC_CA_DE s.isCoherent failed');
  }

  const selected = new Options(s);

  selected.toggle('a');
  if (!arrayEquals(selected.asArray(), ['a', 'c', 'b'])) {
    fail('testExclusiveAB_BC_CA_DE Toggle a expected {a, c, b} got', selected.asArray());
  }

  s.addDep('f', 'f');
  selected.toggle('f');
  if (!arrayEquals(selected.asArray(), ['a', 'c', 'b', 'f'])) {
    fail('testExclusiveAB_BC_CA_DE Toggle f expected {a, c, b, f} got', selected.asArray());
  }

  selected.toggle('e');
  if (!arrayEquals(selected.asArray(), ['e', 'f'])) {
    fail('testExclusiveAB_BC_CA_DE Toggle e expected {e, f} got', selected.asArray());
  }

  selected.toggle('b');
  if (!arrayEquals(selected.asArray(), ['a', 'c', 'b', 'f'])) {
    fail('testExclusiveAB_BC_CA_DE Toggle b expected {a, c, b, f} got', selected.asArray());
  }

  s.addDep('b', 'g');
  selected.toggle('g');
  selected.toggle('b');
  if (!arrayEquals(selected.asArray(), ['g', 'f'])) {
    fail('testExclusiveAB_BC_CA_DE Toggle g, b expected {g, f} got', selected.asArray());
  }
}

function testAB_BC_Toggle() {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addDep('b', 'c');
  const selected = new Options(s);
  selected.toggle('c');
  if (!arrayEquals(selected.asArray(), ['c'])) {
    fail('testAB_BC_Toggle Toggle expected {c} got', selected.asArray());
  }
}

// Multiple dependencies and exclusions.
function testAB_AC() {
  const s = new RuleSet();
  s.addDep('a', 'b');
  s.addDep('a', 'c');
  s.addConflict('b', 'd');
  s.addConflict('b', 'e');
  if (!s.isCoherent()) {
    fail('testAB_AC s.isCoherent failed');
  }

  const selected = new Options(s);
  selected.toggle('d');
  selected.toggle('e');
  selected.toggle('a');
  if (!arrayEquals(selected.asArray(), ['a', 'c', 'b'])) {
    fail('testAB_AC Toggle expected {a, c, b} got', selected.asArray());
  }
}

function arrayEquals(a, b) {
  a.sort();
  b.sort();
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function fail(...args) {
  console.error(...args);
  process.exit(1);
}

const suite = [
  testDependsAA,
  testDependsAB_BA,
  testExclusiveAB,
  testExclusiveAB_BC,
  testDeepDeps,
  testExclusiveAB_BC_CA_DE,
  testAB_BC_Toggle,
  testAB_AC,
];

suite.forEach((t) => t());

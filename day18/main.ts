type Cube = [number, number, number];
type Bound = { min: number; max: number };

function cubeString(c: Cube) {
  return c.map((n) => n.toString()).join(",");
}

function stringCube(s: string): Cube {
  const [x, y, z] = s.split(",").map((v) => Number(v));
  return [x, y, z];
}

function parseInput(input: string): Cube[] {
  return input.split("\n").filter((l) => l.trim()).map(stringCube);
}

function* neighbors(cube: Cube): Generator<Cube> {
  const c: Cube = [...cube];
  for (let i = 0; i < c.length; i++) {
    c[i]++;
    yield c;
    c[i] -= 2;
    yield c;
    c[i]++;
  }
}

export function part1(input: string): number {
  const cubes = parseInput(input);
  const lavaDrop: Set<string> = new Set();
  cubes.forEach((c) => lavaDrop.add(cubeString(c)));

  let count = 0;
  for (const c of cubes) {
    for (const n of neighbors(c)) {
      if (!lavaDrop.has(cubeString(n))) count++;
    }
  }
  return count;
}

function inBounds(bounds: Bound[], cube: Cube): boolean {
  for (let i = 0; i < cube.length; i++) {
    if (bounds[i].min > cube[i] || bounds[i].max < cube[i]) return false;
  }
  return true;
}

function fillOutside(cubes: Cube[]): Set<string> {
  const lavaDrop: Set<string> = new Set();
  cubes.forEach((c) => lavaDrop.add(cubeString(c)));

  const bounds: Bound[] = cubes[0].map((c) => ({ min: c, max: c }));
  for (const c of cubes) {
    for (let i = 0; i < c.length; i++) {
      bounds[i].min = Math.min(c[i], bounds[i].min);
      bounds[i].max = Math.max(c[i], bounds[i].max);
    }
  }

  bounds.forEach((b) => (b.min--, b.max++));

  const outsideDrop: Set<string> = new Set();

  let gen: Set<string> = new Set();
  gen.add(bounds.map((b) => b.min).join(","));

  while (gen.size) {
    gen.forEach((c) => outsideDrop.add(c));

    const nextGen: Set<string> = new Set();
    for (const cs of gen) {
      const c = stringCube(cs);
      for (const n of neighbors(c)) {
        if (!inBounds(bounds, n)) continue;
        if (outsideDrop.has(cubeString(n)) || lavaDrop.has(cubeString(n))) {
          continue;
        }
        nextGen.add(cubeString(n));
      }
    }
    gen = nextGen;
  }

  return outsideDrop;
}

export function part2(input: string): number {
  const cubes = parseInput(input);
  const outsideDrop = fillOutside(cubes);

  let count = 0;
  for (const c of cubes) {
    for (const n of neighbors(c)) {
      if (outsideDrop.has(cubeString(n))) count++;
    }
  }
  return count;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

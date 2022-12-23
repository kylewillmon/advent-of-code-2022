type Location = [number, number];

const locToString = (l: Location) => `${l[0]},${l[1]}`;
const locParse = (s: string): Location => s.split(",").map(Number) as Location;
const locAdd = (a: Location, b: Location) =>
  a.map((v, i) => v + b[i]) as Location;

const ALL_DIRS: Location[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const DIRS: Location[][] = [
  [[-1, 0], [-1, -1], [-1, 1]], // N NW NE
  [[1, 0], [1, -1], [1, 1]], // S SW SE
  [[0, -1], [-1, -1], [1, -1]], // W NW SW
  [[0, 1], [-1, 1], [1, 1]], // E NE SE
];

class Elf {
  constructor(public loc: Location) {}

  propose(map: Map<string, Elf>, dirs: Location[][]): Location {
    if (ALL_DIRS.every((d) => !map.has(locToString(locAdd(this.loc, d))))) {
      return this.loc;
    }

    for (const dir_list of dirs) {
      if (dir_list.every((d) => !map.has(locToString(locAdd(this.loc, d))))) {
        return locAdd(this.loc, dir_list[0]);
      }
    }
    return this.loc;
  }
}

function runStep(
  map: Map<string, Elf>,
  dirs: Location[][],
): [Map<string, Elf>, boolean] {
  const proposed = new Map<string, Elf[]>();
  for (const elf of map.values()) {
    const p = elf.propose(map, dirs);
    const key = locToString(p);
    if (!proposed.has(key)) {
      proposed.set(key, []);
    }
    proposed.get(key)!.push(elf);
  }

  const newMap = new Map<string, Elf>();
  let moved = false;
  for (const [loc, elves] of proposed) {
    if (elves.length == 1) {
      const luckyElf = elves[0];
      const newLoc = locParse(loc);
      if (newLoc.some((v, i) => v != luckyElf.loc[i])) {
        luckyElf.loc = newLoc;
        moved = true;
      }
    }
    elves.forEach((e) => newMap.set(locToString(e.loc), e));
  }

  dirs.push(dirs.shift()!);
  return [newMap, moved];
}

function parse(input: string): Map<string, Elf> {
  const map = new Map<string, Elf>();
  input.split("\n").filter((l) => l.trim()).forEach((l, row) => {
    Array.from(l).forEach((c, col) => {
      if (c == "#") {
        const loc: Location = [row, col];
        map.set(locToString(loc), new Elf(loc));
      }
    });
  });
  return map;
}

function findBounds(map: Map<string, Elf>): [Location, Location] {
  return [...map.values()].reduce(([min, max], elf) => {
    return [
      min.map((v, i) => Math.min(v, elf.loc[i])) as Location,
      max.map((v, i) => Math.max(v, elf.loc[i])) as Location,
    ];
  }, [
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY] as Location,
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY] as Location,
  ]);
}

function print(map: Map<string, Elf>) {
  const [min, max] = findBounds(map);
  for (let r = min[0]; r <= max[0]; r++) {
    let row = "";
    for (let c = min[1]; c <= max[1]; c++) {
      row += map.has(locToString([r, c])) ? "#" : ".";
    }
    console.log(row);
  }
}

export function part1(input: string): number {
  let map = parse(input);
  const dirs = [...DIRS];
  //print(map);
  for (let i = 0; i < 10; i++) {
    map = runStep(map, dirs)[0];
    //console.log();
    //print(map);
  }
  const [min, max] = findBounds(map);
  const area = (max[0] - min[0] + 1) * (max[1] - min[1] + 1);
  return area - map.size;
}

export function part2(input: string): number {
  let map = parse(input);
  const dirs = [...DIRS];
  let moved = false;
  for (let i = 1;; i++) {
    [map, moved] = runStep(map, dirs);
    if (!moved) return i;
  }
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

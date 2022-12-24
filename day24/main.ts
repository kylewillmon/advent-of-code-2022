function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

type Location = [number, number];

const locAdd = (a: Location, b: Location) =>
  a.map((v, i) => v + b[i]) as Location;
const locAddMod = (a: Location, b: Location, m: Location) =>
  a.map((v, i) => mod(v + b[i], m[i])) as Location;
const locEq = (a: Location, b: Location) => a.every((v, i) => v == b[i]);

const DIRS: Location[] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const DIRCHARS = "^>v<";

class Blizzard {
  constructor(public dir: number) {
    if (dir < 0 || dir >= 4) throw new Error(`Bad dir: ${dir}`);
  }

  next(loc: Location, map: Valley): [Location, Blizzard] {
    const newLoc = locAddMod(loc, DIRS[this.dir], map.size());
    return [newLoc, new Blizzard(this.dir)];
  }
}

class Valley {
  constructor(
    public grid: Blizzard[][][],
    public start: Location,
    public end: Location,
  ) {}

  static parse(input: string) {
    const lines = input.split("\n").filter((l) => l.trim()).map((l) =>
      l.substring(1, l.length - 1)
    );
    lines.shift();
    lines.pop();
    const width = lines[0].length;
    const grid = lines
      .map((
        line,
        row,
      ) => (Array.from(line).map((c, col) =>
        c == "." ? [] : [new Blizzard(DIRCHARS.indexOf(c))]
      )));
    return new Valley(grid, [-1, 0], [grid.length, width - 1]);
  }

  print() {
    const [height, width] = this.size();
    for (const row of this.grid) {
      console.log(
        row.map((cell) => {
          if (cell.length == 0) return ".";
          if (cell.length == 1) return DIRCHARS[cell[0].dir];
          if (cell.length < 10) return cell.length.toString();
          return "#";
        }).join(""),
      );
    }
  }

  next(): Valley {
    const [height, width] = this.size();
    const grid = Array.from(
      { length: height },
      () => Array.from({ length: width }, () => [] as Blizzard[]),
    );

    this.grid.forEach((line, row) =>
      line.forEach((cell, col) =>
        cell.forEach((b) => {
          const [[newRow, newCol], newB] = b.next([row, col], this);
          grid[newRow][newCol].push(newB);
        })
      )
    );

    return new Valley(grid, this.start, this.end);
  }

  size(): Location {
    return [this.grid.length, this.grid[0].length];
  }
}

function nextOpts(cur: Location, map: Valley): Location[] {
  const size = map.size();
  const opts = [];
  if (locEq(cur, map.start) || map.grid[cur[0]][cur[1]].length == 0) {
    opts.push(cur);
  }
  for (const d of DIRS) {
    const newLoc = locAdd(cur, d);

    // Nothing else matters. Get OUT!
    if (locEq(newLoc, map.end)) return [newLoc];

    if (newLoc.some((v, i) => v < 0 || v >= size[i])) continue;
    if (map.grid[newLoc[0]][newLoc[1]].length != 0) continue;

    opts.push(newLoc);
  }

  return opts;
}

function solve(map: Valley): [Valley, number] {
  let gen: Location[] = [map.start];
  for (let i = 1;; i++) {
    const nextGen: Location[] = [];
    map = map.next();
    for (const l of gen) {
      for (const nl of nextOpts(l, map)) {
        if (locEq(nl, map.end)) return [map, i];
        nextGen.push(nl);
      }
    }
    if (nextGen.length == 0) break;

    nextGen.sort((a, b) => {
      for (let i = 0; i < a.length; i++) {
        if (a[i] < b[i]) return -1;
        if (b[i] < a[i]) return 1;
      }
      return 0;
    });

    gen = nextGen.filter((v, i) => i == 0 ? true : !locEq(v, nextGen[i - 1]));
  }
  throw new Error("Sim failed.");
}

export function part1(input: string): number {
  const map = Valley.parse(input);
  return solve(map)[1];
}

function swap(map: Valley) {
  const tmp = map.start;
  map.start = map.end;
  map.end = tmp;
}

export function part2(input: string): number {
  let map = Valley.parse(input);
  let n: number;
  let total = 0;
  [map, n] = solve(map);
  total += n;
  swap(map);
  [map, n] = solve(map);
  total += n;
  swap(map);
  [map, n] = solve(map);
  total += n;
  return total;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

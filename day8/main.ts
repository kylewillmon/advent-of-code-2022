type Tree = {
  height: number;
};

type Location = {
  row: number;
  col: number;
};

class Grid<T> {
  g: T[][];
  constructor(g: T[][]) {
    this.g = g;
  }

  get(loc: Location): T | null {
    if (
      loc.row >= 0 && loc.row < this.g.length && loc.col >= 0 &&
      loc.col < this.g[0].length
    ) {
      return this.g[loc.row][loc.col];
    }
    return null;
  }

  forEach(callback: (element: T, loc: Location, grid: Grid<T>) => void) {
    for (let row = 0; row < this.g.length; row++) {
      for (let col = 0; col < this.g[row].length; col++) {
        callback(this.g[row][col], { row, col }, this);
      }
    }
  }

  travelWhile(
    start: Location,
    change: Location,
    callback: (element: T, loc: Location, grid: Grid<T>) => boolean,
  ): boolean {
    const cur = { ...start };
    while (true) {
      cur.row += change.row;
      cur.col += change.col;
      const val = this.get(cur);
      if (!val) break;
      if (!callback(val, cur, this)) return false;
    }
    return true;
  }
}

const DIRS: Location[] = [
  { row: 1, col: 0 },
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 0, col: -1 },
];

function parseInput(input: string): Grid<Tree> {
  return new Grid(
    input
      .split("\n")
      .filter((i) => i.trim().length != 0)
      .map((line) => Array.from(line, (t) => ({ height: Number(t) }))),
  );
}

export function part1(input: string): number {
  const grid = parseInput(input);
  let count = 0;
  grid.forEach((cur, loc, grid) => {
    for (const dir of DIRS) {
      if (grid.travelWhile(loc, dir, (t) => t.height < cur.height)) {
        count += 1;
        break;
      }
    }
  });

  return count;
}

export function part2(input: string): number {
  const grid = parseInput(input);
  let max = 0;
  grid.forEach((cur, loc, grid) => {
    let val = 1;
    for (const dir of DIRS) {
      let count = 0;
      grid.travelWhile(loc, dir, (t) => {
        count += 1;
        return t.height < cur.height;
      });
      val *= count;
    }
    max = Math.max(val, max);
  });

  return max;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

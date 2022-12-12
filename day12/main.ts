type Square = {
  height: number;
  minSteps?: number;
};

type Location = {
  row: number;
  col: number;
};

const DIRS: Location[] = [
  { row: 1, col: 0 },
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 0, col: -1 },
];

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

  forNeighbors(
    start: Location,
    callback: (element: T, loc: Location, grid: Grid<T>) => void,
  ) {
    for (const dir of DIRS) {
      const cur = { row: start.row + dir.row, col: start.col + dir.col };
      const val = this.get(cur);
      if (val) {
        callback(val, cur, this);
      }
    }
  }
}

function parseInput(input: string): [Grid<Square>, Location, Location] {
  let start: Location | null = null;
  let end: Location | null = null;
  const grid = new Grid<Square>(
    input.split("\n")
      .filter((i) => i.trim().length != 0)
      .map((line, row) =>
        Array.from(line).map((val, col) => {
          if (val == "S") {
            start = { row, col };
            val = "a";
          }
          if (val == "E") {
            end = { row, col };
            val = "z";
          }
          return { height: val.charCodeAt(0) - "a".charCodeAt(0) };
        })
      ),
  );
  if (!start || !end) throw new Error("invalid input");
  return [grid, start, end];
}

export function part1(input: string): number | undefined {
  const [grid, start, end] = parseInput(input);
  grid.get(end)!.minSteps = 0;

  let maxCount = grid.g.length * (grid.g[0].length);
  while (grid.get(start)!.minSteps == undefined && maxCount-- > 0) {
    grid.forEach((v, l, grid) => {
      if (v.minSteps == undefined) return;
      grid.forNeighbors(l, (nv) => {
        if (nv.height >= v.height - 1) {
          if (nv.minSteps == undefined || nv.minSteps > v.minSteps! + 1) {
            nv.minSteps = v.minSteps! + 1;
          }
        }
      });
    });
  }

  return grid.get(start)!.minSteps;
}

export function part2(input: string): number | undefined {
  const [grid, , end] = parseInput(input);
  grid.get(end)!.minSteps = 0;

  const maxCount = grid.g.length * (grid.g[0].length);
  for (let i = 0; i < maxCount; i++) {
    grid.forEach((v, l, grid) => {
      if (v.minSteps == undefined) return;
      grid.forNeighbors(l, (nv) => {
        if (nv.height >= v.height - 1) {
          if (nv.minSteps == undefined || nv.minSteps > v.minSteps! + 1) {
            nv.minSteps = v.minSteps! + 1;
          }
        }
      });
    });
  }

  let min = maxCount;
  grid.forEach((v) => {
    if (v.height == 0 && v.minSteps && v.minSteps < min) {
      min = v.minSteps;
    }
  });

  return min;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

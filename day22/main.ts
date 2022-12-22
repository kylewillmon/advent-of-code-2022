function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

enum Tile {
  VOID,
  EMPTY,
  WALL,
}

type Location = [number, number];

const DIRS: Location[] = [
  [0, 1], // RIGHT
  [1, 0], // DOWN
  [0, -1], // LEFT
  [-1, 0], // UP
];
const DIRCHARS = ">v<^";

type Step = {
  go: number;
  turn: number;
};

type Position = {
  loc: Location;
  dir: number;
};

class MonkeyMap {
  constructor(public grid: Tile[][]) {}

  static parse(s: string): MonkeyMap {
    const lines = s.split("\n").filter((s) => s.trim());
    const maxLen = lines.reduce((a, b) => Math.max(a, b.length), 0);
    const grid: Tile[][] = [];
    for (const row of lines) {
      grid.push(
        Array.from(row.padEnd(maxLen, " ")).map((c) => {
          if (c == " ") return Tile.VOID;
          if (c == ".") return Tile.EMPTY;
          if (c == "#") return Tile.WALL;
          throw new Error(`Unexpected character '${c}'`);
        }),
      );
    }
    return new MonkeyMap(grid);
  }

  sideLen(): number {
    return Math.min(this.grid.length, this.grid[0].length) / 3;
  }

  apply(pos: Position, step: Step, next: (pos: Position) => Position) {
    for (let i = 0; i < step.go; i++) {
      const nextPos = next(pos);
      const nextTile = this.grid[nextPos.loc[0]][nextPos.loc[1]];
      if (nextTile != Tile.EMPTY) {
        break;
      }
      pos.loc = nextPos.loc;
      pos.dir = nextPos.dir;
    }
    pos.dir = mod(pos.dir + step.turn, DIRS.length);
  }
}

function p1next(pos: Position, map: MonkeyMap): Position {
  let [r, c] = pos.loc;
  const [dr, dc] = DIRS[pos.dir];
  do {
    r = mod(r + dr, map.grid.length);
    c = mod(c + dc, map.grid[0].length);
  } while (map.grid[r][c] == Tile.VOID);
  return { loc: [r, c], dir: pos.dir };
}

const MEMORY = new Map<string, [Location, number]>();

function askHuman(
  map: MonkeyMap,
  sLoc: Location,
  dir: number,
): [Location, number] {
  const sideLen = map.sideLen();
  const lines: string[] = [];
  let num = 1;
  for (let r = 0; r < map.grid.length; r += sideLen) {
    let row = " ";
    for (let c = 0; c < map.grid[0].length; c += sideLen) {
      if (map.grid[r][c] != Tile.VOID) {
        row += `${num++}`;
      } else {
        row += " ";
      }
    }
    lines.push(row + " ");
  }
  lines.push(" ".repeat(lines[0].length));
  lines.unshift(" ".repeat(lines[0].length));

  let [i, j] = sLoc;
  i++;
  j++;
  lines[i] = lines[i].substring(0, j) + DIRCHARS[dir] +
    lines[i].substring(j + 1);

  for (const l of lines) console.log(l);

  let ans: null | string;
  do {
    ans = prompt(
      "Where should I go (enter a number followed by a ^, <, v, or >):",
    );
  } while (!ans || !ans.match(/^[1-6][<>v^]$/));

  let loc: Location | null = null;
  lines.slice(1, -1).forEach((l, r) => {
    const idx = l.indexOf(ans![0]);
    if (idx != -1) {
      loc = [r, idx - 1];
    }
  });

  if (!loc) throw new Error("WAT");
  return [loc, DIRCHARS.indexOf(ans![1])];
}

function p2next(pos: Position, map: MonkeyMap): Position {
  let [r, c] = pos.loc.map((v, i) => v + DIRS[pos.dir][i]) as Location;
  if (
    r >= 0 && r < map.grid.length && c >= 0 && c < map.grid[0].length &&
    map.grid[r][c] != Tile.VOID
  ) {
    return { loc: [r, c], dir: pos.dir };
  }
  const sideLen = map.sideLen();
  let sLoc: Location = [Math.floor(r / sideLen), Math.floor(c / sideLen)];
  [r, c] = [mod(r, sideLen), mod(c, sideLen)];

  const key = `${sLoc[0]},${sLoc[1]},${pos.dir}`;
  let ans: [Location, number];
  if (MEMORY.has(key)) {
    ans = MEMORY.get(key)!;
  } else {
    ans = askHuman(map, sLoc, pos.dir);
    if (ans[1] == -1) throw new Error("WAT");
    MEMORY.set(key, ans);
  }

  sLoc = ans[0];

  let dir = pos.dir;
  while (dir != ans[1]) {
    dir = mod(dir + 1, 4);
    [r, c] = [c, sideLen - r - 1];
  }

  [r, c] = [sLoc[0] * sideLen + r, sLoc[1] * sideLen + c];

  return { loc: [r, c], dir };
}

function parseSteps(s: string): Step[] {
  const steps: Step[] = [];
  let idx = 0;
  while (idx < s.length) {
    let newIdx = idx;
    while (newIdx < s.length && s[newIdx] != "R" && s[newIdx] != "L") newIdx++;

    const go = Number(s.substring(idx, newIdx));
    let turn: number;
    if (newIdx >= s.length) {
      turn = 0;
    } else if (s[newIdx] == "R") {
      turn = 1;
    } else if (s[newIdx] == "L") {
      turn = -1;
    } else {
      throw new Error("WAT");
    }

    steps.push({ go, turn });
    idx = newIdx + 1;
  }
  return steps;
}

function parse(input: string): [MonkeyMap, Step[]] {
  const [m, s] = input.split("\n\n").filter((s) => s.trim());
  return [MonkeyMap.parse(m), parseSteps(s)];
}

function scorePosition(pos: Position): number {
  const row = pos.loc[0] + 1;
  const col = pos.loc[1] + 1;
  return (1000 * row) + (4 * col) + pos.dir;
}

export function part1(input: string): number {
  const [map, steps] = parse(input);
  const startCol = map.grid[0].findIndex((t) => t == Tile.EMPTY);
  const pos: Position = { loc: [0, startCol], dir: 0 };

  for (const s of steps) {
    map.apply(pos, s, (p) => p1next(p, map));
  }

  return scorePosition(pos);
}

export function part2(input: string): number {
  const [map, steps] = parse(input);
  const startCol = map.grid[0].findIndex((t) => t == Tile.EMPTY);
  const pos: Position = { loc: [0, startCol], dir: 0 };

  for (const s of steps) {
    map.apply(pos, s, (p) => p2next(p, map));
  }

  return scorePosition(pos);
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

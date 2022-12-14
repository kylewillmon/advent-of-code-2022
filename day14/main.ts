enum Stuff {
  ROCK,
  SAND,
}
type Cave = {
  stuff: Map<string, Stuff>;
  maxDepth: number;
};

class Point {
  constructor(public x: number, public y: number) {}

  static parse(point: string): Point {
    const [x, y] = point.split(",");
    return new Point(Number(x), Number(y));
  }

  dirTo(other: Point): [number, number] {
    return [Math.sign(other.x - this.x), Math.sign(other.y - this.y)];
  }

  valueOf() {
    return `${this.x},${this.y}`;
  }
}

function parseCave(input: string): Cave {
  const stuff: Map<string, Stuff> = new Map();
  let maxDepth = 0;
  for (const line of input.split("\n").filter((l) => l.trim() != "")) {
    const points = line.split(" -> ").map(Point.parse);
    const cur = points[0];
    for (let i = 1; i < points.length; i++) {
      const next = points[i];
      do {
        stuff.set(cur.valueOf(), Stuff.ROCK);
        maxDepth = Math.max(maxDepth, cur.y);
        const [dx, dy] = cur.dirTo(next);
        cur.x += dx;
        cur.y += dy;
      } while (cur.x != next.x || cur.y != next.y);
      stuff.set(cur.valueOf(), Stuff.ROCK);
      maxDepth = Math.max(maxDepth, cur.y);
    }
  }
  return { stuff, maxDepth };
}

function dropSand(cave: Cave, hasFloor: boolean): Point | null {
  const cur = new Point(500, 0);

  // Check for something blocking the spawn point
  if (cave.stuff.has(cur.valueOf())) return null;

  while (cur.y < cave.maxDepth + 1) {
    // straight down
    cur.y++;
    if (!cave.stuff.has(cur.valueOf())) {
      continue;
    }
    // A little to the left
    cur.x--;
    if (!cave.stuff.has(cur.valueOf())) {
      continue;
    }
    // A little to the right
    cur.x += 2;
    if (!cave.stuff.has(cur.valueOf())) {
      continue;
    }
    // And stop
    cur.x--;
    cur.y--;
    return cur;
  }

  if (hasFloor) return cur;

  return null;
}

export function part1(input: string): number {
  const cave = parseCave(input);
  let count = 0;
  for (;; count++) {
    const sand = dropSand(cave, false);
    if (!sand) break;
    cave.stuff.set(sand.valueOf(), Stuff.SAND);
  }
  return count;
}

export function part2(input: string): number {
  const cave = parseCave(input);
  let count = 0;
  for (;; count++) {
    const sand = dropSand(cave, true);
    if (!sand) break;
    cave.stuff.set(sand.valueOf(), Stuff.SAND);
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

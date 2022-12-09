const DIR: { [dir: string]: [number, number] } = {
  "R": [0, 1],
  "L": [0, -1],
  "D": [1, 0],
  "U": [-1, 0],
};

class Pos {
  constructor(public row: number, public col: number) {}

  move(dir: string) {
    const diff = DIR[dir];
    this.row += diff[0];
    this.col += diff[1];
  }

  follow(other: Pos) {
    const dr = other.row - this.row;
    const dc = other.col - this.col;
    if (dr ** 2 + dc ** 2 <= 2) return;

    this.row += Math.sign(dr);
    this.col += Math.sign(dc);
  }
}

export function part1(input: string): number {
  const head = new Pos(0, 0);
  const tail = new Pos(0, 0);
  const moves: [string, number][] = input.split("\n")
    .filter((l) => l.trim() != "")
    .map((line) => {
      const [a, b] = line.split(" ");
      return [a, Number(b)];
    });
  const locs = new Set<string>();

  for (const [dir, times] of moves) {
    for (let i = 0; i < times; i++) {
      locs.add(`(${tail.row}, ${tail.col})`);
      head.move(dir);
      tail.follow(head);
    }
  }
  locs.add(`(${tail.row}, ${tail.col})`);

  return locs.size;
}

export function part2(input: string): number {
  const head = new Pos(0, 0);
  const tails: Pos[] = Array.from({ length: 9 }, () => new Pos(0, 0));
  const tail = tails[tails.length - 1];

  const moves: [string, number][] = input.split("\n")
    .filter((l) => l.trim() != "")
    .map((line) => {
      const [a, b] = line.split(" ");
      return [a, Number(b)];
    });
  const locs = new Set<string>();

  for (const [dir, times] of moves) {
    for (let i = 0; i < times; i++) {
      locs.add(`(${tail.row}, ${tail.col})`);
      head.move(dir);
      for (let i = 0; i < tails.length; i++) {
        const f = i == 0 ? head : tails[i - 1];
        tails[i].follow(f);
      }
    }
  }
  locs.add(`(${tail.row}, ${tail.col})`);

  return locs.size;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

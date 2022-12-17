type Rock = number[];

function toRock(...vals: string[]): Rock {
  return vals.reverse().map((v) =>
    parseInt(v.padEnd(5, ".").replaceAll(".", "0").replaceAll("#", "1"), 2)
  );
}

function draw(r: Rock, c: string) {
  for (let i = r.length - 1; i >= 0; i--) {
    const row = r[i]
      .toString(2)
      .padStart(7, ".")
      .replaceAll("0", ".")
      .replaceAll("1", c);
    console.log(`|${row}|`);
  }
}

function blowLeft(r: Rock): boolean {
  if (r.some((row) => row & 0b1000000)) return false;
  for (let i = 0; i < r.length; i++) r[i] <<= 1;
  return true;
}

function blowRight(r: Rock): boolean {
  if (r.some((row) => row & 1)) return false;
  for (let i = 0; i < r.length; i++) r[i] >>= 1;
  return true;
}

const ROCKS = [
  toRock("####"),
  toRock(".#.", "###", ".#."),
  toRock("..#", "..#", "###"),
  toRock("#", "#", "#", "#"),
  toRock("##", "##"),
];

class Tower {
  public data: number[];
  public jet: number;
  constructor(public jets: string) {
    this.data = [];
    this.jet = 0;
  }
  height() {
    return this.data.length;
  }

  settle(r: Rock, height: number) {
    for (let i = 0; i < r.length; i++) {
      while (this.height() <= height + i) this.data.push(0);
      this.data[height + i] |= r[i];
    }
  }

  conflicts(r: Rock, height: number): boolean {
    for (let i = 0; i < r.length; i++) {
      if (height + i >= this.height()) return false;
      if (this.data[height + i] & r[i]) return true;
    }
    return false;
  }

  dropRock(r: Rock) {
    let height = this.height() + 3;
    while (true) {
      const [advance, backtrack] = this.jets[this.jet] == "<"
        ? [blowLeft, blowRight]
        : [blowRight, blowLeft];
      if (advance(r) && this.conflicts(r, height)) {
        backtrack(r);
      }
      this.jet++;
      if (this.jet == this.jets.length) this.jet = 0;

      if (height == 0) break;
      if (this.conflicts(r, height - 1)) break;
      height--;
    }

    this.settle(r, height);
  }
}

export function part1(input: string): number {
  const tower = new Tower(input.trim());
  for (let i = 0; i < 2022; i++) {
    const rock = [...ROCKS[i % 5]];

    // draw(rock, "@");
    // console.log(`|.......|`);
    // console.log(`|.......|`);
    // console.log(`|.......|`);
    // draw(tower.data, "#");
    // console.log(`+-------+`);
    // console.log();

    tower.dropRock(rock);
  }
  return tower.height();
}

export function part2(input: string): number {
  return 0;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

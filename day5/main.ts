function getStacks(input: string): string[][] {
  const stacks: string[][] = [[], [], [], [], [], [], [], [], [], []];
  for (const line of input.split("\n")) {
    for (let i = 1; i < line.length; i += 4) {
      const crate = line[i];
      if (crate !== " ") {
        stacks[Math.floor(i / 4)].push(crate);
      }
    }
  }

  for (const i in stacks) {
    stacks[i].reverse();
  }

  return stacks;
}

function parseInput(input: string): [string[][], Move[]] {
  const [stacks, moves] = input.split("\n\n");
  return [
    getStacks(stacks.slice(0, stacks.lastIndexOf("\n"))),
    moves.split("\n").filter((l) => l.trim().length !== 0).map((m) =>
      new Move(m)
    ),
  ];
}

class Move {
  public count: number;
  public from: number;
  public to: number;

  constructor(line: string) {
    const match = line.match(/move (\d+) from (\d+) to (\d+)/)!;
    this.count = parseInt(match[1]);
    this.from = parseInt(match[2]) - 1;
    this.to = parseInt(match[3]) - 1;
  }
}

export function part1(input: string): string {
  const [stacks, moves] = parseInput(input);
  for (const move of moves) {
    for (let i = 0; i < move.count; i++) {
      const crate = stacks[move.from].pop()!;
      stacks[move.to].push(crate);
    }
  }
  let out = "";
  for (const stack of stacks) {
    if (stack.length !== 0) out += stack.pop();
  }
  return out;
}

export function part2(input: string): string {
  const [stacks, moves] = parseInput(input);
  for (const move of moves) {
    const from = stacks[move.from]!;
    for (let i = 0; i < move.count; i++) {
      const crate = from[from.length - move.count + i];
      stacks[move.to].push(crate);
    }
    for (let i = 0; i < move.count; i++) {
      from.pop();
    }
  }
  let out = "";
  for (const stack of stacks) {
    if (stack.length !== 0) out += stack.pop();
  }
  return out;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

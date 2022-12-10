type Instruction = {
  ins: string;
  val?: number;
};

function parseLine(line: string): Instruction {
  const [a, b] = line.split(" ");
  const i: Instruction = { ins: a! };
  if (b) i.val = Number(b);
  return i;
}

type State = {
  ip: number;
  x: number;
  cycles: number;
};

function runProgTo(prog: Instruction[], cycles: number, state: State) {
  while (state.ip < prog.length) {
    const cur = prog[state.ip];
    const isAdd = cur.ins == "addx";
    const c = isAdd ? 2 : 1;
    if (state.cycles + c >= cycles) return;
    if (isAdd) {
      state.x += cur.val!;
    }
    state.cycles += c;
    state.ip += 1;
  }
}

export function part1(input: string): number {
  const prog = input.split("\n").map(parseLine);
  const state = { ip: 0, x: 1, cycles: 0 };
  let total = 0;
  for (let i = 20; i <= 220; i += 40) {
    runProgTo(prog, i, state);
    total += state.x * i;
  }
  return total;
}

export function part2(input: string): string {
  const prog = input.split("\n").map(parseLine);
  const state = { ip: 0, x: 1, cycles: 0 };
  let output = "";
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 40; j++) {
      runProgTo(prog, (i * 40) + j + 1, state);
      const p = [j - 1, j, j + 1].includes(state.x) ? "#" : ".";
      output += p;
    }
    output += "\n";
  }
  return output;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log(`Part 2:\n\n${part2(input)}`);
}

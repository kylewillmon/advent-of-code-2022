class Monkey {
  constructor(
    public name: string,
    public a: string,
    public op: string,
    public b: string,
  ) {}

  calc(solved: Map<string, number>): number | null {
    const a = solved.get(this.a);
    if (a === undefined) return null;
    const b = solved.get(this.b);
    if (b === undefined) return null;
    if (this.op == "+") {
      return a + b;
    }
    if (this.op == "*") {
      return a * b;
    }
    if (this.op == "-") {
      return a - b;
    }
    if (this.op == "/") {
      return a / b;
    }
    throw new Error(`Unknown op: ${this.op}`);
  }
}

function parse(input: string): [Map<string, number>, Monkey[]] {
  const solved = new Map<string, number>();
  const monkeys: Monkey[] = [];
  for (const line of input.split("\n").filter((l) => l.trim())) {
    const [name, det] = line.split(": ");
    if (det.match(/^\d/)) {
      solved.set(name, Number(det));
    } else {
      const [a, op, b] = det.split(" ");
      monkeys.push(new Monkey(name, a, op, b));
    }
  }
  return [solved, monkeys];
}

export function part1(input: string): number {
  let [solved, monkeys] = parse(input);
  while (!solved.has("root")) {
    monkeys = monkeys.filter((m) => {
      const res = m.calc(solved);
      if (res === null) return true;
      solved.set(m.name, res);
      return false;
    });
  }
  return solved.get("root")!;
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

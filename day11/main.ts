type Monkey = {
  items: number[];
  op: { op: string; val: string };
  tst: { mod: number; yes: number; no: number };
  inspected: number;
};

function parseMonkey(input: string): Monkey {
  const lines = input.split("\n");
  const items = lines[1].split(": ")[1].split(", ").map((n) => Number(n));
  const op = lines[2].split(" old ")[1][0];
  const val = lines[2].split(` ${op} `)[1];
  const mod = Number(lines[3].split(` divisible by `)[1]);
  const yes = Number(lines[4].split(` monkey `)[1]);
  const no = Number(lines[5].split(` monkey `)[1]);

  return {
    items,
    op: { op, val },
    tst: { mod, yes, no },
    inspected: 0,
  };
}

function monkeyTurn(monkeys: Monkey[], idx: number, div3: boolean) {
  const cur = monkeys[idx];
  const items = cur.items;
  cur.items = [];
  cur.inspected += items.length;
  const bigMod = monkeys.map((m) => m.tst.mod).reduce((a, b) => a * b);
  for (let item of items) {
    const val = cur.op.val == "old" ? item : Number(cur.op.val);
    if (cur.op.op == "*") {
      item *= val;
    } else {
      item += val;
    }
    if (div3) item = Math.floor(item / 3);
    item = item % bigMod;
    const tgt = item % cur.tst.mod == 0 ? cur.tst.yes : cur.tst.no;
    monkeys[tgt].items.push(item);
  }
}

export function part1(input: string): number {
  const monkeys = input.split("\n\n").map(parseMonkey);
  for (let i = 0; i < 20; i++) {
    for (let m = 0; m < monkeys.length; m++) {
      monkeyTurn(monkeys, m, true);
    }
  }
  const ins = monkeys.map((m) => m.inspected);
  ins.sort((a, b) => b - a);
  return ins[0] * ins[1];
}

export function part2(input: string): number {
  const monkeys = input.split("\n\n").map(parseMonkey);
  for (let i = 0; i < 10000; i++) {
    for (let m = 0; m < monkeys.length; m++) {
      monkeyTurn(monkeys, m, false);
    }
  }
  const ins = monkeys.map((m) => m.inspected);
  ins.sort((a, b) => b - a);
  return ins[0] * ins[1];
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

type Job = {
  job: "yell";
  val: number;
} | {
  job: "math";
  a: Monkey | string;
  op: string;
  b: Monkey | string;
} | {
  job: "humn";
};

class Monkey {
  constructor(
    public name: string,
    public job: Job,
  ) {}

  musteq(val: number): number {
    const job = this.job;
    if(job.job == "humn") return val;
    if(job.job == "yell") throw new Error("Unexpected yell");

    const {a, op, b} = job;
    if (typeof a == "string" || typeof b == "string") {
      throw new Error(`Invalid op: ${a} ${op} ${b}`);
    }

    if(b.job.job == "yell") {
      const bval = b.job.val;
      if(op == "+") {
        return a.musteq(val-bval);
      } else if (op == "*") {
        return a.musteq(val / bval);
      } else if(op == '-') {
        return a.musteq(val + bval);
      } else if(op == '/') {
        return a.musteq(val * bval);
      }
    }
    if(a.job.job == "yell") {
      const aval = a.job.val;
      if(op == "+") {
        return b.musteq(val - aval);
      } else if (op == "*") {
        return b.musteq(val / aval);
      } else if(op == '-') {
        return b.musteq(aval - val);
      } else if(op == '/') {
        return b.musteq(aval / val);
      }
    }
    console.log(this);
    throw new Error("Unexpected");
  }

  solve(): number | null {
    const job = this.job;
    if (job.job == "yell") return job.val;
    if (job.job == "humn") return null;

    const { a, op, b } = job;
    if (typeof a == "string" || typeof b == "string") {
      throw new Error(`Invalid op: ${a} ${op} ${b}`);
    }

    const aval = a.solve();
    const bval = b.solve();

    if(op == "=") {
      if (aval != null && bval == null) return b.musteq(aval);
      if (bval != null && aval == null) return a.musteq(bval);
      console.log(this); throw new Error("Bad eq");
    }

    if (aval == null || bval == null || op == "=") {
      return null;
    }

    let res: number;
    if (op == "+") {
      res = aval + bval;
    } else if (op == "*") {
      res = aval * bval;
    } else if (op == "-") {
      res = aval - bval;
    } else if (op == "/") {
      res = aval / bval;
    } else {
      throw new Error(`Unknown op: ${op}`);
    }
    this.job = { job: "yell", val: res };
    return res;
  }
}

function parse(input: string): [Monkey, Monkey] {
  const monkeys = new Map<string, Monkey>();
  for (const line of input.split("\n").filter((l) => l.trim())) {
    const [name, det] = line.split(": ");
    if (det.match(/^\d/)) {
      monkeys.set(name, new Monkey(name, { job: "yell", val: Number(det) }));
    } else {
      const [a, op, b] = det.split(" ");
      monkeys.set(name, new Monkey(name, { job: "math", a, op, b }));
    }
  }

  for(const m of monkeys.values()) {
    const job = m.job;
    if(job.job == "math") {
      job.a = monkeys.get(job.a as string)!;
      job.b = monkeys.get(job.b as string)!;
    }
  }

  return [monkeys.get("root")!, monkeys.get("humn")!];
}

export function part1(input: string): number {
  const [root] = parse(input);
  return root.solve()!;
}

export function part2(input: string): number {
  const [root, humn] = parse(input);
  humn.job = { job: "humn" };
  if(root.job.job != "math") throw new Error("Bad root");
  root.job.op = "=";
  return root.solve()!;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

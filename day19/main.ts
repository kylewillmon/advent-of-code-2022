enum Mat {
  ORE = 0,
  CLAY,
  OBSIDIAN,
  GEODE,
}

type Counts = [number, number, number, number];

type Blueprint = {
  id: number;
  cost: [Counts, Counts, Counts, Counts];
  maxNeeded: Counts;
};

type Step = { robot: number; minutes: number };

class State {
  minutes: number;
  robots: Counts;
  inv: Counts;
  blueprint: Blueprint;
  steps: [number, number][];

  constructor(
    minutes: number,
    blueprint: Blueprint,
    robots?: Counts,
    inv?: Counts,
    steps?: [number, number][],
  ) {
    this.minutes = minutes;
    this.robots = robots || [1, 0, 0, 0];
    this.inv = inv || [0, 0, 0, 0];
    this.blueprint = blueprint;
    this.steps = steps || [];
  }

  applyStep(step: Step): State {
    const cost = this.blueprint.cost[step.robot];
    const minutes = this.minutes - step.minutes;
    const robots = [...this.robots] as Counts;
    robots[step.robot]++;
    const inv = this.inv.map((i, r) =>
      i + (this.robots[r] * step.minutes) - cost[r]
    ) as Counts;
    return new State(
      minutes,
      this.blueprint,
      robots,
      inv,
      [...this.steps, [minutes, step.robot]],
    );
  }
}

function options(state: State): Step[] {
  const steps: Step[] = [];
  state.blueprint.cost.forEach((cost, robot) => {
    if (state.robots[robot] >= state.blueprint.maxNeeded[robot]) return;
    if (
      state.inv[robot] + state.minutes * state.robots[robot] >=
        state.blueprint.maxNeeded[robot] * state.minutes
    ) return;
    let minutes = cost.map((c, r) => {
      if (c == 0) return 0;
      if (state.robots[r] == 0) return Number.POSITIVE_INFINITY;
      const needed = Math.max(0, c - state.inv[r]);
      return Math.ceil(needed / state.robots[r]);
    }).reduce((a, b) => Math.max(a, b));

    // One minute to build anything
    minutes = Math.max(1, minutes + 1);
    if (minutes < state.minutes) {
      if (robot == Mat.GEODE && minutes == 1) {
        steps.splice(0, steps.length);
      }
      steps.push({ robot, minutes });
    }
  });
  return steps;
}

function findMax(state: State): number {
  let max = 0;
  let gen: State[] = [state];
  while (gen.length) {
    const nextGen: State[] = [];
    for (const s of gen) {
      const opts = options(s);
      if (opts.length == 0) {
        const score = s.inv[Mat.GEODE] + s.robots[Mat.GEODE] * s.minutes;
        max = Math.max(score, max);
        continue;
      }

      for (const o of opts) {
        nextGen.push(s.applyStep(o));
      }
    }

    // const mins: number[] = Array.from({ length: 25 }, () => 0);
    // nextGen.forEach((s) => mins[s.minutes]++);
    // console.log(mins);
    gen = nextGen;
  }
  return max;
}

function parseBlueprint(line: string): Blueprint {
  const [
    id,
    ore_ore,
    clay_ore,
    obsidian_ore,
    obsidian_clay,
    geode_ore,
    geode_obsidian,
  ] = line.match(
    /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./,
  )!.slice(1).map((v) => Number(v));
  const b: Blueprint = {
    id,
    cost: [
      [ore_ore, 0, 0, 0],
      [clay_ore, 0, 0, 0],
      [obsidian_ore, obsidian_clay, 0, 0],
      [geode_ore, 0, geode_obsidian, 0],
    ],
    maxNeeded: [0, obsidian_clay, geode_obsidian, Number.POSITIVE_INFINITY],
  };
  b.maxNeeded[0] = b.cost.map((c) => c[0]).reduce((a, b) => Math.max(a, b));
  return b;
}

export function part1(input: string): number {
  const bs = input.split("\n").filter((l) => l.trim()).map(parseBlueprint);
  let sum = 0;
  for (const b of bs) {
    const max = findMax(new State(24, b));
    sum += max * b.id;
  }
  return sum;
}

export function part2(input: string): number {
  const bs = input.split("\n").filter((l) => l.trim()).splice(0, 3).map(
    parseBlueprint,
  );
  let prod = 1;
  for (const b of bs) {
    const max = findMax(new State(32, b));
    prod *= max;
  }
  return prod;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

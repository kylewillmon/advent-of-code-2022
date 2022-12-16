type Tunnel = {
  target: string;
  cost: number;
};

class Valve {
  public name: string;
  public rate: number;
  public tunnels: Tunnel[];

  constructor(name: string, rate: number) {
    this.name = name;
    this.rate = rate;
    this.tunnels = [];
  }
  addEdge(target: string, cost: number) {
    this.tunnels.push({ target, cost });
  }
}

type Graph = Map<string, Valve>;

function parseInput(input: string): Graph {
  const valves: Graph = new Map();
  for (const line of input.split("\n").filter((l) => l.trim())) {
    const [, name, rate, edges] = line.match(
      /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/,
    )!;
    const v = new Valve(name, Number(rate));
    for (const t of edges.split(", ")) {
      v.addEdge(t, 1);
    }
    valves.set(name, v);
  }
  return valves;
}

function sssp(valves: Graph, source: string): Map<string, number> {
  const dists: Map<string, number> = new Map();
  dists.set(source, 0);
  for (let i = 0; i < valves.size; i++) {
    for (const v of valves.values()) {
      const vDist = dists.get(v.name);
      if (vDist === undefined) continue;

      for (const t of v.tunnels) {
        const cur = dists.get(t.target);
        if (!cur || vDist + t.cost < cur) {
          dists.set(t.target, vDist + t.cost);
        }
      }
    }
  }
  return dists;
}

function minGraph(valves: Graph): Graph {
  const g: Graph = new Map();
  for (const v of valves.values()) {
    if (v.rate == 0 && v.name != "AA") continue;
    const dists = sssp(valves, v.name);
    const nv = new Valve(v.name, v.rate);
    for (const [name, dist] of dists.entries()) {
      if (dist == 0 || valves.get(name)!.rate == 0) continue;
      nv.addEdge(name, dist);
    }
    g.set(v.name, nv);
  }
  return g;
}

type State = {
  minutes: number;
  closedValves: string[];
  flowRate: number;
  pressure: number;
};

type Person = {
  cur: Valve;
  next: Valve;
  time: number;
};

function search(valves: Graph, state: State, persons: Person[]): number {
  persons = persons.map((p) => ({ ...p }));
  const run = Math.min(state.minutes, ...persons.map((p) => p.time));
  if (run > 0) {
    state.minutes -= run;
    state.pressure += state.flowRate * run;
    for (const p of persons) {
      p.time -= run;
      if (p.time == 0) {
        p.cur = p.next;
        state.flowRate += p.cur.rate;
        state.closedValves.splice(
          state.closedValves.findIndex((v) => v == p.cur.name)!,
          1,
        );
      }
    }
  }

  let maxPressure = state.pressure + (state.minutes * state.flowRate);
  for (const p of persons) {
    if (p.time != 0) {
      maxPressure += p.next.rate * (state.minutes - p.time);
    }
  }

  const pIdx = persons.findIndex((p) => p.time == 0)!;
  const p = { ...persons[pIdx] };
  persons.splice(pIdx, 1);

  for (const target of state.closedValves) {
    if (persons.find((p) => p.next.name == target)) continue;
    const cost = p.cur.tunnels.find((t) => t.target == target)!.cost;
    const toOpen = cost + 1;
    if (state.minutes - toOpen > 0) {
      const v = valves.get(target)!;
      p.next = v;
      p.time = toOpen;

      const newState = {
        minutes: state.minutes,
        closedValves: [...state.closedValves],
        flowRate: state.flowRate,
        pressure: state.pressure,
      };

      const newPersons = persons.map((p) => ({ ...p }));
      newPersons.push(p);

      const pressure = search(valves, newState, newPersons);
      if (pressure > maxPressure) {
        maxPressure = pressure;
      }
    }
  }
  return maxPressure;
}

function searchGraph(
  valves: Graph,
  minutes: number,
  numPersons: number,
): number {
  const persons = [];
  for (let i = 0; i < numPersons; i++) {
    persons.push({
      cur: valves.get("AA")!,
      next: valves.get("AA")!,
      time: 0,
    });
  }

  return search(valves, {
    minutes,
    closedValves: [...valves.values()]
      .map((v) => v.name).filter((v) => v != "AA"),
    flowRate: 0,
    pressure: 0,
  }, persons);
}

export function part1(input: string): number {
  const valves = minGraph(parseInput(input));
  return searchGraph(valves, 30, 1);
}

export function part2(input: string): number {
  const valves = minGraph(parseInput(input));
  return searchGraph(valves, 26, 2);
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

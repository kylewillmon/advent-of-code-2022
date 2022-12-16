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
  cur: Valve;
  minute: number;
  openValves: string[];
  flowRate: number;
  pressure: number;
};

function search(valves: Graph, state: State): number {
  let maxPressure = state.pressure + ((30 - state.minute) * state.flowRate);
  for (const { target, cost } of state.cur.tunnels) {
    if (state.openValves.includes(target)) continue;

    const minute = state.minute + cost + 1;
    if (minute < 30) {
      const v = valves.get(target)!;
      const pressure = state.pressure +
        ((minute - state.minute) * state.flowRate);

      const openValves = [target, ...state.openValves];

      const newState = {
        cur: v,
        minute,
        openValves,
        flowRate: state.flowRate + v.rate,
        pressure,
      };

      maxPressure = Math.max(maxPressure, search(valves, newState));
    }
  }
  return maxPressure;
}

function searchGraph(valves: Graph): number {
  return search(valves, {
    cur: valves.get("AA")!,
    minute: 0,
    openValves: [],
    flowRate: 0,
    pressure: 0,
  });
}

export function part1(input: string): number {
  const valves = minGraph(parseInput(input));
  return searchGraph(valves);
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

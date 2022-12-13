type Packet = (number | Packet)[];

function compare(a: Packet, b: Packet): number {
  const numCmp = Math.min(a.length, b.length);
  for (let i = 0; i < numCmp; i++) {
    const ai = a[i];
    const bi = b[i];
    let c: number;
    if (typeof ai === "number") {
      if (typeof bi === "number") {
        c = ai - bi;
      } else {
        c = compare([ai], bi);
      }
    } else if (typeof bi === "number") {
      c = compare(ai, [bi]);
    } else {
      c = compare(ai, bi);
    }
    if (c != 0) return c;
  }
  return a.length - b.length;
}

export function part1(input: string): number {
  let count = 0;
  let idx = 1;
  for(const lines of input.split("\n\n").filter((l) => l.trim().length != 0)) {
    const [a, b] = lines.split('\n');
    if(compare(JSON.parse(a), JSON.parse(b)) <= 0) count+=idx;
    idx++;
  }
  return count;
}

export function part2(input: string): number {
  const pkts = input.split('\n').filter((l) => l.trim().length != 0).map((l): Packet => JSON.parse(l));
  pkts.sort(compare);
  const first = pkts.findIndex((v) => compare(v, [[2]]) >= 0) + 1;
  const second = pkts.findIndex((v) => compare(v, [[6]]) >= 0) + 2;
  return first * second;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

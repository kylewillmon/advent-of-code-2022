function toMove(s: string): number {
  if (s == "A" || s == "X") return 1;
  if (s == "B" || s == "Y") return 2;
  return 3;
}

function whatBeats(m: number): number {
  if (m == 3) return 1;
  return m + 1;
}

function beatsWhat(m: number): number {
  if (m == 1) return 3;
  return m - 1;
}

function whatIsMe(them: number, outcome: number): number {
  if (outcome == 1) {
    return beatsWhat(them);
  } else if (outcome == 2) {
    return them;
  }
  return whatBeats(them);
}

export function part1(input: string): number {
  let score = 0;
  for (const line of input.split("\n")) {
    if (!line.trim()) continue;
    const [a, b] = line.split(" ", 2);
    score += calcScore(toMove(a), toMove(b));
  }
  return score;
}

export function part2(input: string): number {
  let score = 0;
  for (const line of input.split("\n")) {
    if (!line.trim()) continue;
    const [a, b] = line.split(" ", 2);
    const them = toMove(a);
    score += calcScore(them, whatIsMe(them, toMove(b)));
  }
  return score;
}

function calcScore(them: number, me: number): number {
  if (me == them) {
    return me + 3;
  } else if (me == whatBeats(them)) {
    return me + 6;
  }
  return me;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

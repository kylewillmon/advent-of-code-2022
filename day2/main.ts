export function part1(input: string): number {
  let score = 0;
  for (const line of input.split("\n")) {
    if (!line.trim()) continue;
    score += calcScore1(line.trim());
  }
  return score;
}

export function part2(input: string): number {
  let score = 0;
  for (const line of input.split("\n")) {
    if (!line.trim()) continue;
    score += calcScore2(line.trim());
  }
  return score;
}

export function calcScore1(line: string): number {
  const [a, b] = line.split(" ", 2);
  const them = a.codePointAt(0)! - 64;
  const me = b.codePointAt(0)! - "X".codePointAt(0)! + 1;
  let outcome = 0;
  if (me == them) {
    outcome = 3;
  } else if (me == them + 1 || (me == 1 && them == 3)) {
    outcome = 6;
  }

  return me + outcome;
}

export function calcScore2(line: string): number {
  const [a, b] = line.split(" ", 2);
  const them = a.codePointAt(0)! - 64;
  const outcome = b.codePointAt(0)! - "X".codePointAt(0)! + 1;

  if (outcome == 1) {
    // Lose
    let me = them - 1;
    if(me == 0) me = 3;
    return me;
  }

  if (outcome == 2) {
    // Draw
    return them + 3;
  }

  // Win
  let me = them + 1;
  if (me == 4) me = 1;
  return 6 + me;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

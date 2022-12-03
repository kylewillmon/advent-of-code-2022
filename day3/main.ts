function priority(item: string): number {
  const cp = item.codePointAt(0)!;
  if (cp > 96) return cp - 96;
  return cp - 64 + 26;
}

function sharedItem(line: string): string {
  const split = line.length / 2;
  const first = line.substring(0, split);
  const second = line.substring(split);

  for (const item of first) {
    if (second.includes(item)) {
      return item;
    }
  }
  return " ";
}

function groupBadge(a: string, b: string, c: string): string {
  for (const item of a) {
    if (b.includes(item) && c.includes(item)) return item;
  }
  throw 1;
}

export function part1(input: string): number {
  let score = 0;
  for (const line of input.split("\n")) {
    if (line.trim() == "") continue;
    const item = sharedItem(line);
    score += priority(item);
  }
  return score;
}

export function part2(input: string): number {
  let score = 0;
  const lines = input.split("\n").filter((l) => l.trim() != "");
  for (let i = 0; i < lines.length; i += 3) {
    const item = groupBadge(lines[i], lines[i + 1], lines[i + 2]);
    score += priority(item);
  }
  return score;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

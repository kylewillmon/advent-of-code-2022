class Range {
  start: number;
  end: number;

  constructor(spec: string) {
    const [start, end] = spec.split("-");
    this.start = parseInt(start);
    this.end = parseInt(end);
  }

  contains(other: Range): boolean {
    return this.start <= other.start && this.end >= other.end;
  }

  intersects(other: Range): boolean {
    if (this.start > other.end || this.end < other.start) {
      return false;
    }
    return true;
  }
}

function parseLine(line: string): [Range, Range] {
  const [a, b] = line.split(",");
  return [new Range(a), new Range(b)];
}

export function part1(input: string): number {
  const lines = input.split("\n").filter((l) => l.trim().length > 0);
  let count = 0;
  for (const line of lines) {
    const [a, b] = parseLine(line);
    if (a.contains(b) || b.contains(a)) count += 1;
  }
  return count;
}

export function part2(input: string): number {
  const lines = input.split("\n").filter((l) => l.trim().length > 0);
  let count = 0;
  for (const line of lines) {
    const [a, b] = parseLine(line);
    if (a.intersects(b)) count += 1;
  }
  return count;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

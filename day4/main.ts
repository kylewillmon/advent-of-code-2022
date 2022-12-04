function parse(a: string): number[] {
  const [start, end] = a.split('-');
  return [parseInt(start), parseInt(end)]
}

export function part1(input: string): number {
  const lines = input.split("\n").filter((l) => l.trim().length > 0);
  let count = 0;
  for (const line of lines) {
    const [a, b] = line.split(",");
    const [astart, aend] = parse(a);
    const [bstart, bend] = parse(b);
    if (astart < bstart) {
      if (aend >= bend) {
        count += 1;
      }
    } else if (astart > bstart) {
      if (aend <= bend) {
        count += 1;
      }
    } else {
      count += 1;
    }
  }
  return count;
}

export function part2(input: string): number {
  const lines = input.split("\n").filter((l) => l.trim().length > 0);
  let count = 0;
  for (const line of lines) {
    const [a, b] = line.split(",");
    const [astart, aend] = parse(a);
    const [bstart, bend] = parse(b);
    if (astart < bstart) {
      if (aend >= bstart) {
        count += 1;
      }
    } else if (astart > bstart) {
      if (astart <= bend) {
        count += 1;
      }
    } else {
      count += 1;
    }
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

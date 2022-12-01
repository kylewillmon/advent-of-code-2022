export function part1(input: string): number {
  const elves = parseElves(input);
  return elves.reduce((max, cur) => cur > max ? cur : max, 0);
}

export function part2(input: string): number {
  const elves = parseElves(input);
  elves.sort((a, b) => a - b);
  return elves.pop()! + elves.pop()! + elves.pop()!;
}

function parseElves(input: string): number[] {
  const elves: number[] = [];
  let total = 0;
  for (const line of input.split("\n")) {
    if (line === "") {
      elves.push(total);
      total = 0;
    } else {
      total += parseInt(line);
    }
  }
  if (total !== 0) {
    elves.push(total);
  }
  return elves;
}

if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

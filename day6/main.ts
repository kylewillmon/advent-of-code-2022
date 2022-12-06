function validMarker(input: string, len: number): boolean {
  if (input.length !== len) return false;
  for (let i = 1; i < len; i++) {
    if (input.indexOf(input[i]) !== i) return false;
  }
  return true;
}

export function part1(input: string): number {
  for (let i = 4; i < input.length; i++) {
    if (validMarker(input.slice(i - 4, i), 4)) return i;
  }
  throw "Invalid sequence";
}

export function part2(input: string): number {
  for (let i = 14; i < input.length; i++) {
    if (validMarker(input.slice(i - 14, i), 14)) return i;
  }
  throw "Invalid sequence";
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

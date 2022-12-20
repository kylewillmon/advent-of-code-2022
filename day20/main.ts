/** Mod... But without the dumb negative results */
function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

function moveInPlace(list: [number, number][], pos: number) {
  const idx = list.findIndex(([p, _v]) => p == pos);
  const val = list[idx];

  list.splice(idx, 1);
  const newIdx = mod(idx + val[1], list.length);
  list.splice(newIdx, 0, val);
}

export function part1(input: string): number {
  const list = input.split("\n")
    .filter((l) => l.trim())
    .map((l) => Number(l))
    .map((v, p) => [p, v]) as [number, number][]; // Store original positiion

  for (let i = 0; i < list.length; i++) {
    moveInPlace(list, i);
  }

  const zero = list.findIndex(([_p, v]) => v == 0);
  const get = (idx: number) => list[mod(zero + idx, list.length)][1];

  return get(1000) + get(2000) + get(3000);
}

export function part2(input: string): number {
  const DECRYPTION_KEY = 811589153;
  const list = input.split("\n")
    .filter((l) => l.trim())
    .map((l) => Number(l))
    .map((v, p) => [p, v * DECRYPTION_KEY]) as [number, number][]; // Store original positiion

  for (let round = 0; round < 10; round++) {
    for (let i = 0; i < list.length; i++) {
      moveInPlace(list, i);
    }
  }

  const zero = list.findIndex(([_p, v]) => v == 0);
  const get = (idx: number) => list[mod(zero + idx, list.length)][1];

  return get(1000) + get(2000) + get(3000);
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

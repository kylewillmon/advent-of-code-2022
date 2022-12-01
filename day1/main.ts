import type { Reader } from "https://deno.land/std@0.167.0/io/types.d.ts";
import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
import { maxOf } from "https://deno.land/std@0.167.0/collections/max_of.ts";
import { Direction, SortService } from "https://deno.land/x/sort@v1.1.1/mod.ts";

export async function part1(reader: Reader): Promise<number> {
  return maxOf(await readElves(reader), (i) => i) as number;
}

export async function part2(reader: Reader): Promise<number> {
  const elves = SortService.sort(await readElves(reader), Direction.DESCENDING);
  return elves[0] + elves[1] + elves[2];
}

async function readElves(reader: Reader): Promise<number[]> {
  const elves: number[] = [];
  let total = 0;
  for await (const line of readLines(reader)) {
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
  console.log("Part 1: ", await part1(await Deno.open("input.txt")));
  console.log("Part 2: ", await part2(await Deno.open("input.txt")));
}

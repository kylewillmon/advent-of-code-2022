import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1, part2 } from "./main.ts";

const example = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

Deno.test(function day12Test() {
  assertEquals(part1(example), 31);
  assertEquals(part2(example), 29);
});

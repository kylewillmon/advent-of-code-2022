import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1, part2 } from "./main.ts";

const example = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

Deno.test(function day14Test() {
  assertEquals(part1(example), 24);
  assertEquals(part2(example), 93);
});

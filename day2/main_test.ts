import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1, part2 } from "./main.ts";

const example = `A Y
B X
C Z`;

Deno.test(function part1Test() {
  assertEquals(part1(example), 15);
});

Deno.test(function part2Test() {
  assertEquals(part2(example), 12);
});

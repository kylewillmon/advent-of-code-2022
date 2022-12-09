import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1, part2 } from "./main.ts";

const example = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const big = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

Deno.test(function day9Test() {
  assertEquals(part1(example), 13);
  assertEquals(part2(example), 1);
  assertEquals(part2(big), 36);
});

import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1, part2 } from "./main.ts";

const example = `30373
25512
65332
33549
35390`;

Deno.test(function day8Test() {
  assertEquals(part1(example), 21);
  assertEquals(part2(example), 8);
});

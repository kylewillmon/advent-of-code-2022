import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1, part2 } from "./main.ts";

const example = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

Deno.test(function day17Test() {
  assertEquals(part1(example), 3068);
  assertEquals(part2(example), 0);
});

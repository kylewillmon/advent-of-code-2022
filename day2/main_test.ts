import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { calcScore1, calcScore2, part1, part2 } from "./main.ts";

const example = `A Y
B X
C Z`;

Deno.test(function calcScoreTest() {
  assertEquals(calcScore1('A Y'), 8);
  assertEquals(calcScore1('B X'), 1);
  assertEquals(calcScore1('C Z'), 6);
});

Deno.test(function calcScore2Test() {
  assertEquals(calcScore2('A Y'), 4);
  assertEquals(calcScore2('B X'), 1);
  assertEquals(calcScore2('C Z'), 7);
});

Deno.test(function part1Test() {
  assertEquals(part1(example), 15);
});

Deno.test(function part2Test() {
  assertEquals(part2(example), 12);
});

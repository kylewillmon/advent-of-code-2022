import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1, part2 } from "./main.ts";

const example = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

Deno.test(function day18Test() {
  assertEquals(part1("1,1,1\n2,1,1"), 10);
  assertEquals(part1(example), 64);
  assertEquals(part2(example), 58);
});

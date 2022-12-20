import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1, part2 } from "./main.ts";

const example = `
1
2
-3
3
-2
0
4
`;

Deno.test("example", () => {
  assertEquals(part1(example), 3);
  assertEquals(part2(example), 1623178306);
});

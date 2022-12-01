import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

import { part1, part2 } from "./main.ts";

const example = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
`;

Deno.test("part1 example", () => {
  assertEquals(part1(example), 24000);
});

Deno.test("part2 example", () => {
  assertEquals(part2(example), 45000);
});

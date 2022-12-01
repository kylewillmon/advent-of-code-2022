import { part1, part2 } from "./main.ts";
import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { StringReader } from "https://deno.land/std@0.167.0/io/mod.ts";

let example = `1000
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

Deno.test("part1 example", async () => {
  assertEquals(await part1(new StringReader(example)), 24000);
});

Deno.test("part2 example", async () => {
  assertEquals(await part2(new StringReader(example)), 45000);
});

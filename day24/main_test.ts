import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1, part2 } from "./main.ts";

const example = `
#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#
`;

Deno.test("example", () => {
  assertEquals(part1(example), 18);
  assertEquals(part2(example), 54);
});

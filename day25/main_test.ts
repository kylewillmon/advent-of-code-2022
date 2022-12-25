import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1 } from "./main.ts";

const example = `
1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122
`;

Deno.test("example", () => {
  assertEquals(part1(example), "2=-1=0");
});

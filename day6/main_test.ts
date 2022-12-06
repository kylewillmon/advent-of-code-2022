import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1, part2 } from "./main.ts";

const example = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;

Deno.test(function day6Part1Test() {
  assertEquals(part1("mjqjpqmgbljsphdztnvjfqwrcgsmlb"), 7);
  assertEquals(part1("bvwbjplbgvbhsrlpgdmjqwftvncz"), 5);
  assertEquals(part1("nppdvjthqldpwncqszvftbrmjlhg"), 6);
  assertEquals(part1("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), 10);
  assertEquals(part1("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), 11);
});

Deno.test(function day6Part2Test() {
  assertEquals(part2("mjqjpqmgbljsphdztnvjfqwrcgsmlb"), 19);
  assertEquals(part2("bvwbjplbgvbhsrlpgdmjqwftvncz"), 23);
  assertEquals(part2("nppdvjthqldpwncqszvftbrmjlhg"), 23);
  assertEquals(part2("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), 29);
  assertEquals(part2("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), 26);
});

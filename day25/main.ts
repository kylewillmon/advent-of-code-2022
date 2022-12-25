const CHARS = "=-012";

function parse(input: string): number[] {
  const nums: number[] = [];
  for (const line of input.split("\n").filter((l) => l.trim())) {
    let val = 0;
    for (const c of Array.from(line)) {
      val *= 5;
      const cval = CHARS.indexOf(c) - 2;
      val += cval;
    }
    nums.push(val);
  }
  return nums;
}

function toSNAFU(num: number): string {
  const digits = Array.from(num.toString(5), (d) => Number(d)).reverse();
  let carry = 0;
  for (let i = 0; i < digits.length; i++) {
    if (carry) {
      digits[i] += carry;
      carry = 0;
    }
    if (digits[i] > 2) {
      digits[i] -= 5;
      carry = 1;
    }
  }
  if (carry) digits.push(carry);
  return digits.reverse().map((d) => CHARS[d + 2]).join("");
}

export function part1(input: string): string {
  const nums = parse(input);
  const sum = nums.reduce((a, b) => a + b);
  return toSNAFU(sum);
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
}

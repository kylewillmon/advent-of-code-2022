type Dir = {
  name: string;
  size: number;
};

function parseDirs(input: string): Dir[] {
  const lines = input.split("\n").filter((l) => l.trim().length != 0);
  const dirs: Dir[] = [];
  let cur = [];
  let cur_dirs: Dir[] = [];
  for (const line of lines) {
    if (line.startsWith("$")) {
      if (line.startsWith("$ cd")) {
        const target = line.replace("$ cd ", "");
        if (target == "/") {
          cur = [];
        } else if (target == "..") {
          cur.pop();
        } else {
          cur.push(target);
        }
      } else if (line == "$ ls") {
        cur_dirs = [];
        for (let i = 0; i <= cur.length; i++) {
          const target = "/" + cur.slice(0, i).join("/");
          let this_dir = dirs.find((d) => d.name == target);
          if (!this_dir) {
            this_dir = { name: target, size: 0 };
            dirs.push(this_dir);
          }
          cur_dirs.push(this_dir);
        }
      }
    } else {
      if (!line.startsWith("dir")) {
        const [size] = line.split(" ", 2);
        for (const dir of cur_dirs) {
          dir.size += parseInt(size);
        }
      }
    }
  }
  return dirs;
}

export function part1(input: string): number {
  const dirs = parseDirs(input);
  let total = 0;
  for (const dir of dirs) {
    if (dir.size < 100000) total += dir.size;
  }
  return total;
}

export function part2(input: string): number {
  const dirs = parseDirs(input);
  const total = dirs.find((d) => d.name == "/")!.size;
  const options = dirs.filter((d) => total - d.size < 70000000 - 30000000);
  let min = 70000000;
  for (const opt of options) {
    if (opt.size < min) {
      min = opt.size;
    }
  }
  return min;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

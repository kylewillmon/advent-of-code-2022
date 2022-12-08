type Tree = {
  height: number;
};

function parseInput(input: string): Tree[][] {
  const grid = input.split("\n").filter((i) => i.trim().length != 0);
  const tree_grid: Tree[][] = [];

  for (const row of grid) {
    const tree_row: Tree[] = [];
    for (let i = 0; i < row.length; i++) {
      tree_row.push({ height: parseInt(row[i]) });
    }
    tree_grid.push(tree_row);
  }
  return tree_grid;
}

function* betweens(
  grid: Tree[][],
  r: number,
  c: number,
  dr: number,
  dc: number,
): IterableIterator<Tree> {
  let row = r + dr;
  let col = c + dc;
  while (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
    yield grid[row][col];
    row += dr;
    col += dc;
  }
}

function every(
  trees: IterableIterator<Tree>,
  pred: (t: Tree) => boolean,
): boolean {
  for (const t of trees) {
    if (!pred(t)) return false;
  }
  return true;
}

export function part1(input: string): number {
  const grid = parseInput(input);
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cur = grid[r][c];
      const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
      for (const [dr, dc] of dirs) {
        if (every(betweens(grid, r, c, dr, dc), (t) => t.height < cur.height)) {
          count += 1;
          break;
        }
      }
    }
  }

  return count;
}

function countTrees(trees: Iterable<Tree>, pred: (t: Tree) => boolean): number {
  let count = 0;
  for (const t of trees) {
    count += 1;
    if (!pred(t)) break;
  }
  return count;
}

export function part2(input: string): number {
  const grid = parseInput(input);
  let max = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cur = grid[r][c];
      const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
      let val = 1;
      for (const [dr, dc] of dirs) {
        val *= countTrees(
          betweens(grid, r, c, dr, dc),
          (t) => t.height < cur.height,
        );
      }
      if (val > max) max = val;
    }
  }

  return max;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input));
  console.log("Part 2: ", part2(input));
}

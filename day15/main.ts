type Location = [number, number];
type Sensor = {
  loc: Location;
  beacon: Location;
};

function parseSensor(line: string): Sensor {
  const [, sx, , sy, , bx, , by] = line.split(/[=,:]/);
  return { loc: [Number(sx), Number(sy)], beacon: [Number(bx), Number(by)] };
}

function getBox(sensors: Sensor[]): [Location, Location] {
  return sensors
    .map((s): [Location, Location] => [s.loc, s.loc])
    .reduce((acc, cur) => {
      const [val] = cur;
      const [minAcc, maxAcc] = acc;
      return [
        [Math.min(minAcc[0], val[0]), Math.min(minAcc[1], val[1])],
        [Math.max(maxAcc[0], val[0]), Math.max(maxAcc[1], val[1])],
      ];
    });
}

function manhattenDist(a: Location, b: Location): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function isSeen(sensors: Sensor[], loc: Location): boolean {
  for (const s of sensors) {
    if (manhattenDist(s.loc, loc) <= manhattenDist(s.loc, s.beacon)) {
      return true;
    }
  }
  return false;
}

export function part1(input: string, tgtRow: number): number {
  const sensors = input
    .split("\n")
    .filter((l) => l.trim() != "")
    .map(parseSensor);
  const [minLoc, maxLoc] = getBox(sensors);
  let minX = minLoc[0];
  let maxX = maxLoc[0];
  while (isSeen(sensors, [minX, tgtRow])) minX--;
  while (isSeen(sensors, [maxX, tgtRow])) maxX++;
  let count = 0;
  for (let x = minX; x <= maxX; x++) {
    const thisLoc: Location = [x, tgtRow];
    const isBeacon = sensors.find((s) =>
      s.beacon.every((b, i) => b == thisLoc[i])
    );
    if (isSeen(sensors, thisLoc) && !isBeacon) {
      count++;
    }
  }
  return count;
}

export function part2(input: string): number {
  return 0;
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input, 2000000));
  console.log("Part 2: ", part2(input));
}

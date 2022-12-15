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

function* outOfReach(sensor: Sensor): Generator<Location> {
  const loc = sensor.loc;
  const dist = manhattenDist(loc, sensor.beacon) + 1;
  for (let i = 0; i < dist; i++) {
    const j = dist - i;
    yield [loc[0] + i, loc[1] - j];
    yield [loc[0] - i, loc[1] + j];
    yield [loc[0] + j, loc[1] + i];
    yield [loc[0] - j, loc[1] - i];
  }
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

export function part2(input: string, bounds: [number, number]): number {
  const sensors = input
    .split("\n")
    .filter((l) => l.trim() != "")
    .map(parseSensor);
  for (const s of sensors) {
    for (const maybe of outOfReach(s)) {
      if (
        maybe.every((coord) => coord >= bounds[0] && coord <= bounds[1]) &&
        !isSeen(sensors, maybe)
      ) {
        return maybe[0] * 4000000 + maybe[1];
      }
    }
  }
  throw new Error("No solution found");
}

if (import.meta.main) {
  const input = Deno.readTextFileSync(
    new URL(import.meta.resolve("./input.txt")),
  );
  console.log("Part 1: ", part1(input, 2000000));
  console.log("Part 2: ", part2(input, [0, 4000000]));
}

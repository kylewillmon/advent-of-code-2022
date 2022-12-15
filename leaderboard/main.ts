import * as colors from "https://deno.land/std@0.167.0/fmt/colors.ts";

type Leaderboard = {
  event: string;
  owner_id: number;
  members: {
    [user: string]: {
      local_score: number;
      stars: number;
      name?: string;
      id: number;
      global_score: number;
      last_star_ts: number;
      completion_day_level: {
        [day: string]: {
          1?: { get_star_ts: number; star_index: number };
          2?: { get_star_ts: number; star_index: number };
        };
      };
    };
  };
};

type Day = {
  part1: { name: string; time: Date }[];
  part2: { name: string; time: Date }[];
};

function getParams(): [string, string] {
  const lbid = Deno.env.get("LEADERBOARD");
  const session_cookie = Deno.env.get("SESSION_COOKIE");

  if (lbid && session_cookie) return [lbid!, session_cookie!];

  throw "LEADERBOARD and SESSION_COOKIE environment variables are required";
}

async function leaderboard(): Promise<Leaderboard> {
  const [lbid, session_cookie] = getParams();
  const url =
    `https://adventofcode.com/2022/leaderboard/private/view/${lbid}.json`;

  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set("Cookie", `session=${session_cookie}`);
  return await fetch(url, { headers }).then((response) => {
    console.assert(response.ok);
    return response.json();
  });
}

function tsToDate(ts: number): Date {
  // Puzzles are released in -0500, so might as well use that timezone here.
  return new Date((ts - (5 * 60 * 60)) * 1000);
}

function getDays(lb: Leaderboard): Day[] {
  const days = [];
  for (let d = 1; d <= 25; d++) {
    const day: Day = { part1: [], part2: [] };
    for (const user of Object.values(lb.members)) {
      const name = user.name || `Anonymous user #${user.id}`;
      const p1 = user.completion_day_level[`${d}`]?.["1"]?.get_star_ts;
      if (p1) {
        day.part1.push({ name: name, time: tsToDate(p1) });
      }
      const p2 = user.completion_day_level[`${d}`]?.["2"]?.get_star_ts;
      if (p2) {
        day.part2.push({ name: name, time: tsToDate(p2) });
      }
    }
    day.part1.sort((a, b) => a.time.valueOf() - b.time.valueOf());
    day.part2.sort((a, b) => a.time.valueOf() - b.time.valueOf());
    days.push(day);
  }
  return days;
}

function dateToString(date: Date): string {
  // Puzzles are released in -0500, so might as well use that timezone here.
  return date.toISOString().replace("T", " ").replace(".000Z", "");
}

function dec2022(date: Date): boolean {
  return date.getUTCFullYear() == 2022 && date.getUTCMonth() == 11
}

function formatter(date: Date, curDay: number): (string) => string {
  if(!dec2022(date)) return colors.gray;
  if(date.getUTCDate() == curDay) return colors.brightGreen;
  if(date.getUTCDate() == curDay + 1) return colors.yellow;
  return colors.gray;
}

if (import.meta.main) {
  const lb = await leaderboard();
  const days = getDays(lb);
  for (let d = 0; d < days.length; d++) {
    const day = days[d];
    if (day.part1.length !== 0) {
      console.log(`Day ${d + 1}, Part 1:`);
      for (const res of day.part1) {
        const fmt = formatter(res.time, d+1);
        console.log(fmt(`  ${res.name.padEnd(25, " ")} ${dateToString(res.time)}`));
      }
      console.log();
    }
    if (day.part2.length !== 0) {
      console.log(`Day ${d + 1}, Part 2:`);
      for (const res of day.part2) {
        const fmt = formatter(res.time, d+1);
        console.log(fmt(`  ${res.name.padEnd(25, " ")} ${dateToString(res.time)}`));
      }
      console.log();
    }
  }
}

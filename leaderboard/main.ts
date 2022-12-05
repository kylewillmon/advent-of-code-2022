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
  part1: { name: string; time: number }[];
  part2: { name: string; time: number }[];
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

function getDays(lb: Leaderboard): Day[] {
  const days = [];
  for (let d = 1; d <= 25; d++) {
    const day: Day = { part1: [], part2: [] };
    for (const user of Object.values(lb.members)) {
      const name = user.name || `Anonymous user #${user.id}`;
      const p1 = user.completion_day_level[`${d}`]?.["1"]?.get_star_ts;
      if (p1) {
        day.part1.push({ name: name, time: p1 });
      }
      const p2 = user.completion_day_level[`${d}`]?.["2"]?.get_star_ts;
      if (p2) {
        day.part2.push({ name: name, time: p2 });
      }
    }
    day.part1.sort((a, b) => a.time - b.time);
    day.part2.sort((a, b) => a.time - b.time);
    days.push(day);
  }
  return days;
}

function dateToString(ts: number): string {
  const date = new Date(ts * 1000);
  return date.toISOString();
}

if (import.meta.main) {
  const lb = await leaderboard();
  const days = getDays(lb);
  for (let d = 0; d < days.length; d++) {
    const day = days[d];
    if (day.part1.length !== 0) {
      console.log(`Day ${d + 1}, Part 1:`);
      for (const res of day.part1) {
        console.log(`  ${res.name.padEnd(25, " ")} ${dateToString(res.time)}`);
      }
      console.log();
    }
    if (day.part2.length !== 0) {
      console.log(`Day ${d + 1}, Part 2:`);
      for (const res of day.part2) {
        console.log(`  ${res.name.padEnd(25, " ")} ${dateToString(res.time)}`);
      }
      console.log();
    }
  }
}

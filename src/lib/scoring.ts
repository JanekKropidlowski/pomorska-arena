export type Athlete = {
  id: string;
  name: string;
  team: string;
  gender?: 'M' | 'K';
};

export type ShootingEntry = {
  athleteId: string;
  pistol: number[]; // 5
  rifle: number[];  // 5
};

export type RunEntry = {
  athleteId: string;
  place: number; // 1..n (czas opcjonalny)
  timeMs?: number;
};

export type GrenadeEntry = {
  athleteId: string;
  attempts: [number, number, number]; // 0..3 pkt per próba
  tieDistanceCm?: number; // mniejsza lepsza
};

export type IndividualResult = {
  athleteId: string;
  total: number; // lub place -> zamieniamy na score wg klucza przy drużynówce
  tiebreak?: number; // mniejszy lepszy, np. cm w granacie
};

// Punktacja drużynowa zgodnie z regulaminem: 1→15pkt, 2→13pkt, 3→11pkt, 4→10pkt, 5→9pkt, 6→8pkt, 7→7pkt, 8→6pkt, 9→5pkt, 10→4pkt, 11→3pkt, 12→2pkt, 13+→1pkt
const TEAM_POINTS = [15, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

export function scoreShooting(entries: ShootingEntry[]): IndividualResult[] {
  return entries.map(e => ({
    athleteId: e.athleteId,
    total: sum(e.pistol) + sum(e.rifle),
  })).sort((a, b) => b.total - a.total);
}

export function scoreRun(entries: RunEntry[]): IndividualResult[] {
  // tylko miejsce — mniejsze lepsze. Zamieniamy na „total” odwrotnie do miejsca, ale kolejność ważniejsza
  return [...entries]
    .sort((a, b) => a.place - b.place)
    .map(e => ({ athleteId: e.athleteId, total: -e.place }));
}

export function scoreGrenade(entries: GrenadeEntry[]): IndividualResult[] {
  return [...entries]
    .map(e => ({
      athleteId: e.athleteId,
      total: e.attempts[0] + e.attempts[1] + e.attempts[2],
      tiebreak: e.tieDistanceCm ?? Number.POSITIVE_INFINITY,
    }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      // remis: mniejsza odległość wygrywa
      return (a.tiebreak ?? Infinity) - (b.tiebreak ?? Infinity);
    });
}

export function toTeamPoints(sortedAthleteIds: string[]): Map<string, number> {
  const map = new Map<string, number>();
  sortedAthleteIds.forEach((athleteId, idx) => {
    const points = idx < TEAM_POINTS.length ? TEAM_POINTS[idx] : 1;
    map.set(athleteId, points);
  });
  return map;
}

export function aggregateTeamScores(
  athleteResults: IndividualResult[],
  athleteById: Map<string, Athlete>,
): Map<string, number> {
  // Ustal kolejność (desc total), wyznacz punkty drużynowe wg miejsca
  const sorted = [...athleteResults].sort((a, b) => b.total - a.total);
  const teamPtsPerAthlete = toTeamPoints(sorted.map(r => r.athleteId));
  const teamTotals = new Map<string, number>();
  sorted.forEach(r => {
    const athlete = athleteById.get(r.athleteId);
    if (!athlete) return;
    const inc = teamPtsPerAthlete.get(r.athleteId) ?? 0;
    teamTotals.set(athlete.team, (teamTotals.get(athlete.team) ?? 0) + inc);
  });
  return teamTotals;
}

function sum(arr: Array<number | undefined>): number {
  return arr.reduce((s, v) => s + (v || 0), 0);
}



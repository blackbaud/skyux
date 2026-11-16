import { type SkyChartTimeUnit } from '@skyux/charts';

export const TEAMS = ['Team A', 'Team B', 'Team C', 'Team D'] as const;

type Team = (typeof TEAMS)[number];
type Scores = Record<Team, number>;

export interface TimeScaleReading {
  date: string;
  average: number;
  teams: Scores;
}

export const TIME_SCALE_SCENARIOS = {
  year: 'A year of mostly daily readings',
  quarter: 'Three months, sometimes several a day',
  'flat-then-drop': 'Two months unchanged, then a drop',
  sparse: 'Two readings a day apart',
} as const;

export type TimeScaleScenario = keyof typeof TIME_SCALE_SCENARIOS;

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const LAST_DAY = Date.UTC(2026, 10, 1);

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function clamp(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function reading(time: number, teams: Scores): TimeScaleReading {
  const scores = TEAMS.map((team) => teams[team]);

  return {
    date: new Date(time).toISOString(),
    average: clamp(scores.reduce((sum, score) => sum + score, 0) / 4),
    teams,
  };
}

function randomWalk(options: {
  days: number;
  seed: number;
  skipChance: number;
  extraChance: number;
}): TimeScaleReading[] {
  const random = seededRandom(options.seed);
  const scores: Scores = {
    'Team A': 62,
    'Team B': 48,
    'Team C': 70,
    'Team D': 55,
  };
  const readings: TimeScaleReading[] = [];

  for (let day = options.days - 1; day >= 0; day--) {
    if (random() < options.skipChance) {
      continue;
    }

    const count = random() < options.extraChance ? 2 : 1;

    for (let i = 0; i < count; i++) {
      for (const team of TEAMS) {
        const roll = random();

        if (roll < 0.04) {
          scores[team] = clamp(scores[team] + (random() < 0.6 ? 12 : -10));
        } else if (roll < 0.3) {
          scores[team] = clamp(scores[team] + (random() < 0.55 ? 1 : -1));
        }
      }

      const hour = 13 + Math.floor(random() * 9) + i * 2;
      readings.push(
        reading(LAST_DAY - day * DAY_MS + hour * HOUR_MS, { ...scores }),
      );
    }
  }

  return readings.sort((a, b) => a.date.localeCompare(b.date));
}

function flatThenDrop(): TimeScaleReading[] {
  const before: Scores = {
    'Team A': 35,
    'Team B': 25,
    'Team C': 30,
    'Team D': 30,
  };
  const after: Scores = { ...before, 'Team B': 5, 'Team C': 20 };
  const firstDay = LAST_DAY - 62 * DAY_MS;

  return Array.from({ length: 63 }, (_, day) =>
    reading(firstDay + day * DAY_MS + 15 * HOUR_MS, day < 61 ? before : after),
  );
}

export function timeScaleReadings(
  scenario: TimeScaleScenario,
): TimeScaleReading[] {
  switch (scenario) {
    case 'year':
      return randomWalk({
        days: 365,
        seed: 7,
        skipChance: 0.25,
        extraChance: 0.05,
      });
    case 'quarter':
      return randomWalk({
        days: 90,
        seed: 21,
        skipChance: 0.3,
        extraChance: 0.25,
      });
    case 'flat-then-drop':
      return flatThenDrop();
    case 'sparse':
      return [
        reading(LAST_DAY - DAY_MS + 15 * HOUR_MS, {
          'Team A': 60,
          'Team B': 40,
          'Team C': 72,
          'Team D': 50,
        }),
        reading(LAST_DAY + 16 * HOUR_MS, {
          'Team A': 64,
          'Team B': 40,
          'Team C': 72,
          'Team D': 58,
        }),
      ];
  }
}

const UNIT_POINT_COUNT = 8;
const UNIT_SCORES = [40, 55, 48, 62, 70, 58, 75, 80];

function addUnits(date: Date, unit: SkyChartTimeUnit, amount: number): Date {
  const next = new Date(date);

  switch (unit) {
    case 'millisecond':
      next.setMilliseconds(next.getMilliseconds() + amount);
      break;
    case 'second':
      next.setSeconds(next.getSeconds() + amount);
      break;
    case 'minute':
      next.setMinutes(next.getMinutes() + amount);
      break;
    case 'hour':
      next.setHours(next.getHours() + amount);
      break;
    case 'day':
      next.setDate(next.getDate() + amount);
      break;
    case 'week':
      next.setDate(next.getDate() + amount * 7);
      break;
    case 'month':
      next.setMonth(next.getMonth() + amount);
      break;
    case 'quarter':
      next.setMonth(next.getMonth() + amount * 3);
      break;
    case 'year':
      next.setFullYear(next.getFullYear() + amount);
      break;
  }

  return next;
}

function startOfUnit(unit: SkyChartTimeUnit): Date {
  const date = new Date(2026, 0, 15, 10, 30, 45, 123);

  switch (unit) {
    case 'millisecond':
      break;
    case 'second':
      date.setMilliseconds(0);
      break;
    case 'minute':
      date.setSeconds(0, 0);
      break;
    case 'hour':
      date.setMinutes(0, 0, 0);
      break;
    case 'day':
      date.setHours(0, 0, 0, 0);
      break;
    case 'week':
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - date.getDay());
      break;
    case 'month':
    case 'quarter':
      date.setHours(0, 0, 0, 0);
      date.setDate(1);
      break;
    case 'year':
      date.setHours(0, 0, 0, 0);
      date.setMonth(0, 1);
      break;
  }

  return date;
}

export function unitReadings(unit: SkyChartTimeUnit): {
  dates: string[];
  scores: number[];
} {
  const start = startOfUnit(unit);

  return {
    dates: Array.from({ length: UNIT_POINT_COUNT }, (_, index) =>
      addUnits(start, unit, index).toISOString(),
    ),
    scores: UNIT_SCORES,
  };
}

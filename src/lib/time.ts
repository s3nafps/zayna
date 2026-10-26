// Brief §9: dates are shown in Africa/Algiers. Day boundaries (today, last 7 days) use that zone too.
export const LOCAL_TIME_ZONE = "Africa/Algiers";

type LocalParts = { year: number; month: number; day: number; hour: number; minute: number; second: number };

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: LOCAL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function localParts(date: Date): LocalParts {
  const values = new Map(partsFormatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: Number(values.get("year")),
    month: Number(values.get("month")),
    day: Number(values.get("day")),
    hour: Number(values.get("hour")),
    minute: Number(values.get("minute")),
    second: Number(values.get("second")),
  };
}

// Offset of the local zone from UTC at this instant, in milliseconds (+1 hour for Algeria).
function localOffsetMs(date: Date): number {
  const p = localParts(date);
  const wallClockAsUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const truncatedInstant = Math.floor(date.getTime() / 1000) * 1000;
  return wallClockAsUtc - truncatedInstant;
}

// "YYYY-MM-DD" for the local calendar day of an instant.
export function localDateKey(date: Date): string {
  const p = localParts(date);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

// The instant at which the local calendar day starts, shifted by whole days.
export function localStartOfDay(date: Date, addDays = 0): Date {
  const p = localParts(date);
  const localMidnightAsUtc = Date.UTC(p.year, p.month - 1, p.day + addDays);
  return new Date(localMidnightAsUtc - localOffsetMs(date));
}

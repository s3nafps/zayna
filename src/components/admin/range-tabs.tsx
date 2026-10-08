import Link from "next/link";

export type RangeTabsProps = {
  current: "today" | "week";
  labels: { today: string; week: string; group: string };
};

// Today or the last seven days. A link per option, so the page stays server-rendered.
export function RangeTabs({ current, labels }: RangeTabsProps) {
  const options = [
    { value: "today", label: labels.today },
    { value: "week", label: labels.week },
  ] as const;
  return (
    <nav aria-label={labels.group} className="inline-flex rounded-full bg-surface-container p-0.5">
      {options.map((option) => {
        const active = option.value === current;
        return (
          <Link
            key={option.value}
            href={`/admin?range=${option.value}`}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-tap items-center rounded-full px-4 font-sans text-label-md font-semibold transition-colors ${
              active ? "bg-primary-container text-on-primary-container shadow-atmospheric" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}

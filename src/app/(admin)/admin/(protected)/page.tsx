import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BarChart } from "@/components/admin/bar-chart";
import { DataTable } from "@/components/admin/data-table";
import { KpiCard } from "@/components/admin/kpi-card";
import { RangeTabs } from "@/components/admin/range-tabs";
import { StatusPill } from "@/components/ui/status-pill";
import { loadOrdersForDashboard, loadWilayaNames } from "@/lib/dashboard/load";
import {
  PIPELINE_GROUP_KEYS,
  buildWindows,
  computeAlerts,
  computeDailySeries,
  computeKpis,
  computePipeline,
  computeTopWilayas,
  type Range,
} from "@/lib/dashboard/metrics";
import { formatCount, formatRate } from "@/lib/format";
import { formatDzd } from "@/lib/money";

// Live numbers from the database. Never cached.
export const dynamic = "force-dynamic";

const DAY_FORMAT = new Intl.DateTimeFormat("fr-DZ", { timeZone: "Africa/Algiers", day: "2-digit", month: "2-digit" });
const DATE_FORMAT = new Intl.DateTimeFormat("fr-DZ", {
  timeZone: "Africa/Algiers",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const TIME_FORMAT = new Intl.DateTimeFormat("fr-DZ", { timeZone: "Africa/Algiers", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeParam } = await searchParams;
  const range: Range = rangeParam === "today" ? "today" : "week";
  const now = new Date();

  const [orders, wilayas, t, tOrders] = await Promise.all([
    loadOrdersForDashboard(now),
    loadWilayaNames(),
    getTranslations("admin.dashboard"),
    getTranslations("admin.orders"),
  ]);

  const windows = buildWindows(now, range);
  const kpis = computeKpis(orders, windows);
  const pipeline = computePipeline(orders, windows);
  const series = computeDailySeries(orders, now);
  const topWilayas = computeTopWilayas(orders, windows);
  const alerts = computeAlerts(orders);
  const todayAmount = series.at(-1)?.amount ?? 0;

  const wilayaLabel = (code: string) => {
    const wilaya = wilayas.get(code);
    return wilaya ? `${code} - ${wilaya.nameFr}` : code;
  };

  const chartPoints = series.map((point) => ({
    label: DAY_FORMAT.format(new Date(`${point.date}T12:00:00+01:00`)),
    amount: point.amount,
    count: point.count,
  }));

  const alertRows = alerts.items.map((order) => ({
    id: order.id,
    cells: {
      number: <span className="font-sans font-semibold">{order.number}</span>,
      customer: (
        <span className="flex flex-col">
          <span>{order.customerName}</span>
          <a href={`tel:${order.phone}`} className="text-label-md text-primary underline" dir="ltr">
            {order.phone}
          </a>
        </span>
      ),
      wilaya: wilayaLabel(order.wilayaCode),
      total: formatDzd(order.total),
      status: <StatusPill status={order.status} />,
    },
  }));

  const wilayaRows = topWilayas.map((row) => ({
    id: row.wilayaCode,
    cells: {
      wilaya: wilayaLabel(row.wilayaCode),
      orders: formatCount(row.count),
      amount: formatDzd(row.amount),
    },
  }));

  const orderColumns = [
    { key: "number", header: tOrders("columns.number") },
    { key: "customer", header: tOrders("columns.customer") },
    { key: "wilaya", header: tOrders("columns.wilaya") },
    { key: "total", header: tOrders("columns.total") },
    { key: "status", header: tOrders("columns.status") },
  ];

  const pipelineCards = PIPELINE_GROUP_KEYS.map((group) => ({
    group,
    count: pipeline[group],
    href: `/admin/orders?group=${group}`,
  }));

  const dateLabel = DATE_FORMAT.format(now);
  const timeLabel = TIME_FORMAT.format(now);

  return (
    <div className="flex flex-col gap-6 p-margin lg:p-margin-desktop">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-headline-lg font-medium text-on-surface">{t("title")}</h1>
          <p className="font-sans text-body-sm text-on-surface-variant">
            {t("updated", { date: dateLabel, time: timeLabel })}
          </p>
        </div>
        <RangeTabs current={range} labels={{ today: t("range.today"), week: t("range.week"), group: t("range.label") }} />
      </header>

      {/* Desktop and tablet: 1024px and up */}
      <div className="hidden flex-col gap-6 lg:flex">
        <section aria-label={t("kpi.heading")} className="grid grid-cols-3 gap-gutter-desktop">
          <KpiCard label={t("kpi.newToday")} value={formatCount(kpis.newToday)} hint={t("kpi.newTodayHint")} />
          <KpiCard label={t("kpi.toConfirm")} value={formatCount(kpis.toConfirm)} hint={t("kpi.toConfirmHint")} />
          <KpiCard label={t("kpi.inRoute")} value={formatCount(kpis.inRoute)} hint={t("kpi.inRouteHint")} />
          <KpiCard
            label={t("kpi.delivered")}
            value={formatCount(kpis.delivered)}
            hint={t("kpi.deliveredHint", { rate: formatRate(kpis.deliveryRate) })}
          />
          <KpiCard
            label={t("kpi.returns")}
            value={formatCount(kpis.returns)}
            hint={t("kpi.returnsHint", { rate: formatRate(kpis.returnRate) })}
          />
          <KpiCard label={t("kpi.codInTransit")} value={formatDzd(kpis.codInTransit)} hint={t("kpi.codInTransitHint")} />
        </section>

        <section className="grid grid-cols-5 gap-gutter-desktop">
          <div className="col-span-3 rounded-xl border border-gold-border bg-surface-container-lowest p-4 shadow-atmospheric">
            <BarChart
              title={t("chart.title")}
              points={chartPoints}
              summary={t("chart.summary", { count: series.reduce((sum, p) => sum + p.count, 0) })}
              columnLabels={{ day: t("chart.columns.day"), orders: t("chart.columns.orders"), amount: t("chart.columns.amount") }}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-3 rounded-xl border border-gold-border bg-surface-container-lowest p-4 shadow-atmospheric">
            <h2 className="font-sans text-label-lg font-semibold text-on-surface">{t("wilayas.title")}</h2>
            {topWilayas.length === 0 ? (
              <p className="font-sans text-body-sm text-on-surface-variant">{t("wilayas.empty")}</p>
            ) : (
              <DataTable
                columns={[
                  { key: "wilaya", header: t("wilayas.columns.wilaya") },
                  { key: "orders", header: t("wilayas.columns.orders") },
                  { key: "amount", header: t("wilayas.columns.amount") },
                ]}
                rows={wilayaRows}
                compact
              />
            )}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-sans text-label-lg font-semibold text-on-surface">
            {t("alerts.title", { count: alerts.total })}
          </h2>
          <p className="font-sans text-body-sm text-on-surface-variant">{t("alerts.body")}</p>
          {alertRows.length === 0 ? (
            <p className="rounded-xl border border-gold-border bg-surface-container-lowest p-4 font-sans text-body-md text-on-surface-variant">
              {t("alerts.empty")}
            </p>
          ) : (
            <DataTable columns={orderColumns} rows={alertRows} />
          )}
        </section>
      </div>

      {/* Phone: seller view with the COD pipeline and quick actions */}
      <div className="flex flex-col gap-4 lg:hidden">
        <section aria-label={t("kpi.heading")} className="grid grid-cols-2 gap-gutter">
          <KpiCard label={t("mobile.todaySales")} value={formatDzd(todayAmount)} />
          <KpiCard label={t("kpi.codInTransit")} value={formatDzd(kpis.codInTransit)} />
          <KpiCard label={t("kpi.newToday")} value={formatCount(kpis.newToday)} />
          <KpiCard label={t("kpi.deliveredShort")} value={formatRate(kpis.deliveryRate)} />
        </section>

        <section aria-labelledby="pipeline-heading" className="flex flex-col gap-2">
          <h2 id="pipeline-heading" className="font-sans text-label-lg font-semibold text-on-surface">
            {t("mobile.pipeline")}
          </h2>
          <ul className="grid grid-cols-2 gap-gutter">
            {pipelineCards.map((card) => (
              <li key={card.group}>
                <Link
                  href={card.href}
                  className="flex min-h-tap flex-col gap-1 rounded-xl border border-gold-border bg-surface-container-lowest p-3 shadow-atmospheric"
                >
                  <span className="font-sans text-label-md text-on-surface-variant">{t(`pipeline.${card.group}`)}</span>
                  <span className="font-sans text-headline-md font-semibold text-on-surface tabular">
                    {formatCount(card.count)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="actions-heading" className="flex flex-col gap-2">
          <h2 id="actions-heading" className="font-sans text-label-lg font-semibold text-on-surface">
            {t("mobile.actions")}
          </h2>
          <div className="grid grid-cols-2 gap-gutter">
            <Link
              href="/admin/orders?group=toConfirm"
              className="inline-flex min-h-tap items-center justify-center rounded-lg border border-deep-gold bg-primary-container px-3 font-sans text-label-lg font-semibold text-on-primary-container"
            >
              {t("mobile.confirm")}
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex min-h-tap items-center justify-center rounded-lg border border-gold-border px-3 font-sans text-label-lg font-semibold text-on-surface"
            >
              {t("mobile.allOrders")}
            </Link>
          </div>
        </section>

        <section aria-labelledby="alerts-heading" className="flex flex-col gap-2">
          <h2 id="alerts-heading" className="font-sans text-label-lg font-semibold text-on-surface">
            {t("alerts.title", { count: alerts.total })}
          </h2>
          {alerts.items.length === 0 ? (
            <p className="font-sans text-body-md text-on-surface-variant">{t("alerts.empty")}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {alerts.items.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-col gap-1 rounded-xl border border-gold-border bg-surface-container-lowest p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-sans text-label-lg font-semibold">{order.number}</span>
                    <StatusPill status={order.status} />
                  </div>
                  <span className="font-sans text-body-sm text-on-surface-variant">
                    {order.customerName} · {wilayaLabel(order.wilayaCode)} · {formatDzd(order.total)}
                  </span>
                  <a href={`tel:${order.phone}`} className="font-sans text-label-md text-primary underline" dir="ltr">
                    {order.phone}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { DataTable } from "@/components/admin/data-table";
import { StatusPill } from "@/components/ui/status-pill";
import { loadWilayaNames } from "@/lib/dashboard/load";
import { formatDzd } from "@/lib/money";
import { ORDER_FILTERS, PAGE_SIZE, parseOrderFilter, parsePage, type OrderFilter } from "@/lib/orders/list";
import { loadOrdersPage } from "@/lib/orders/query";

// Read-only list for now. Confirm, edit and ship actions arrive later in Phase 3.
export const dynamic = "force-dynamic";

const DATE_TIME = new Intl.DateTimeFormat("fr-DZ", {
  timeZone: "Africa/Algiers",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function hrefFor(filter: OrderFilter, page?: number): string {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("group", filter);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/orders?${query}` : "/admin/orders";
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string; page?: string }>;
}) {
  const params = await searchParams;
  const filter = parseOrderFilter(params.group);
  const requestedPage = parsePage(params.page);
  const [result, wilayas, t] = await Promise.all([
    loadOrdersPage(filter, requestedPage),
    loadWilayaNames(),
    getTranslations("admin.orders"),
  ]);
  const page = Math.min(requestedPage, result.pageCount);

  const rows = result.rows.map((order) => {
    const wilaya = wilayas.get(order.wilayaCode);
    return {
      id: order.id,
      cells: {
        number: <span className="font-sans font-semibold">{order.number}</span>,
        date: DATE_TIME.format(order.createdAt),
        customer: (
          <span className="flex flex-col">
            <span>{order.customerName}</span>
            <a href={`tel:${order.phone}`} className="text-label-md text-primary underline" dir="ltr">
              {order.phone}
            </a>
          </span>
        ),
        wilaya: wilaya ? `${order.wilayaCode} - ${wilaya.nameFr}` : order.wilayaCode,
        total: formatDzd(order.total),
        status: <StatusPill status={order.status as Parameters<typeof StatusPill>[0]["status"]} />,
      },
    };
  });

  const columns = [
    { key: "number", header: t("columns.number") },
    { key: "date", header: t("columns.date") },
    { key: "customer", header: t("columns.customer") },
    { key: "wilaya", header: t("columns.wilaya") },
    { key: "total", header: t("columns.total") },
    { key: "status", header: t("columns.status") },
  ];

  return (
    <div className="flex flex-col gap-6 p-margin lg:p-margin-desktop">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-headline-lg font-medium text-on-surface">{t("title")}</h1>
        <p className="font-sans text-body-sm text-on-surface-variant">{t("subtitle", { count: result.total })}</p>
      </header>

      <nav aria-label={t("filtersLabel")} className="flex flex-wrap gap-2">
        {ORDER_FILTERS.map((key) => {
          const active = key === filter;
          return (
            <Link
              key={key}
              href={hrefFor(key)}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-tap items-center rounded-full px-4 font-sans text-label-md font-semibold ${
                active
                  ? "bg-primary-container text-on-primary-container shadow-atmospheric"
                  : "border border-gold-border bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {t(`filters.${key}`)}
            </Link>
          );
        })}
      </nav>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-gold-border bg-surface-container-lowest p-6 font-sans text-body-md text-on-surface-variant">
          {t("empty")}
        </p>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      {result.pageCount > 1 ? (
        <nav aria-label={t("pagination.label")} className="flex items-center justify-between gap-3">
          {page > 1 ? (
            <Link href={hrefFor(filter, page - 1)} className="min-h-tap rounded-lg border border-gold-border px-4 py-2 font-sans text-label-lg">
              {t("pagination.previous")}
            </Link>
          ) : (
            <span />
          )}
          <span className="font-sans text-body-sm text-on-surface-variant">
            {t("pagination.page", { page, pages: result.pageCount, size: PAGE_SIZE })}
          </span>
          {page < result.pageCount ? (
            <Link href={hrefFor(filter, page + 1)} className="min-h-tap rounded-lg border border-gold-border px-4 py-2 font-sans text-label-lg">
              {t("pagination.next")}
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}

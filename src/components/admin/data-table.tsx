import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

export type DataTableColumn = { key: string; header: string };
export type DataTableRow = { id: string; cells: Record<string, ReactNode> };

export type DataTableProps = {
  columns: DataTableColumn[];
  rows: DataTableRow[];
};

// Admin list table. Columns align to the start edge, so RTL works without changes.
export async function DataTable({ columns, rows }: DataTableProps) {
  const t = await getTranslations("common");
  return (
    <div className="overflow-x-auto rounded-xl border border-gold-border bg-surface-container-lowest">
      <table className="w-full min-w-[640px] border-collapse text-start font-sans text-body-md">
        <thead className="bg-surface-container-low">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-3 py-2 text-start text-label-md font-semibold text-on-surface-variant"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-6 text-center text-on-surface-variant">
                {t("emptyTable")}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-t border-gold-border">
                {columns.map((column) => (
                  <td key={column.key} className="px-3 py-2 text-start align-middle text-on-surface">
                    {row.cells[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

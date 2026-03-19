import { cn } from "@/frontend/theme/tokens";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ResponsiveTable — Renders as <table> on desktop (md+), card stack on mobile.
 */

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  primary?: boolean;
  hideOnMobile?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  mobileCard?: (row: T) => React.ReactNode;
  totalItems?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  headerBg?: string;
}

export function ResponsiveTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  mobileCard,
  totalItems,
  page = 1,
  pageSize = 10,
  onPageChange,
  emptyMessage = "No data to display",
  headerBg,
}: ResponsiveTableProps<T>) {
  const total = totalItems ?? data.length;
  const totalPages = Math.ceil(total / pageSize);
  const primaryCol = columns.find((c) => c.primary) || columns[0];
  const detailCols = columns.filter((c) => c !== primaryCol && !c.hideOnMobile);

  if (data.length === 0) {
    return (
      <div className="finance-card p-12 text-center">
        <p className="text-sm" style={{ color: cn.textSecondary }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block finance-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: headerBg || cn.bgInput, borderBottom: `1px solid ${cn.borderLight}` }}>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-xs"
                    style={{
                      color: cn.textSecondary,
                      textAlign: col.align || "left",
                      width: col.width,
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="border-b transition-all"
                  style={{
                    borderColor: cn.borderLight,
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                  onClick={() => onRowClick?.(row)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = cn.bgInput; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3"
                      style={{ textAlign: col.align || "left" }}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && onPageChange && (
          <div className="px-4 py-3 flex items-center justify-between border-t" style={{ borderColor: cn.borderLight }}>
            <p className="text-xs" style={{ color: cn.textSecondary }}>
              Showing {(page - 1) * pageSize + 1}&ndash;{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className="w-8 h-8 rounded-lg text-xs transition-all"
                  style={{
                    background: p === page ? cn.pink : "transparent",
                    color: p === page ? "white" : cn.textSecondary,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Card Stack */}
      <div className="md:hidden space-y-3">
        {data.map((row) => (
          <div
            key={keyExtractor(row)}
            className="finance-card p-4 space-y-2"
            style={{ cursor: onRowClick ? "pointer" : "default" }}
            onClick={() => onRowClick?.(row)}
          >
            {mobileCard ? (
              mobileCard(row)
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-sm" style={{ color: cn.text }}>
                    {primaryCol.render(row)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  {detailCols.map((col) => (
                    <div key={col.key} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: cn.textSecondary }}>{col.label}</span>
                      <span className="text-xs" style={{ color: cn.text }}>{col.render(row)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}

        {totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-xs cn-touch-target disabled:opacity-30"
              style={{ color: cn.text, background: cn.bgInput }}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-xs" style={{ color: cn.textSecondary }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-xs cn-touch-target disabled:opacity-30"
              style={{ color: cn.text, background: cn.bgInput }}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
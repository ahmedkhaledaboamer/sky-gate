'use client';

import { Skeleton } from './States';

/**
 * columns: [{ key, header, render?(row), className?, headerClassName? }]
 * Scrolls horizontally on small screens; shows skeleton rows while loading.
 */
export function DataTable({ columns, rows = [], rowKey = (row) => row._id, isLoading, skeletonRows = 6, empty }) {
  const showSkeleton = isLoading && rows.length === 0;
  return (
    <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap ${col.headerClassName ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y divide-slate-100 ${isLoading && rows.length ? 'opacity-60' : ''}`}>
            {showSkeleton
              ? Array.from({ length: skeletonRows }, (_, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-4">
                        <Skeleton className="h-4 w-full max-w-[140px]" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr key={rowKey(row)} className="hover:bg-slate-50/60 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3.5 text-slate-700 align-middle ${col.className ?? ''}`}>
                        {col.render ? col.render(row) : row[col.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {!isLoading && rows.length === 0 && empty}
    </div>
  );
}

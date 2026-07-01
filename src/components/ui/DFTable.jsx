import React from 'react';
import clsx from 'clsx';

const DFTable = ({
  columns,
  data,
  onRowClick,
  className = "",
  loading = false,
  emptyMessage = "No hay datos disponibles"
}) => {
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-20 text-center glass-card border-dashed border-white/10">
        <p className="df-label opacity-40 uppercase tracking-widest">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={clsx("overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5">
            {columns.map((col, index) => (
              <th
                key={index}
                className={clsx(
                  "py-4 px-4 df-label !text-zinc-500 font-bold uppercase tracking-widest",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={clsx(
                "border-b border-white/5 transition-colors hover:bg-white/5",
                onRowClick && "cursor-pointer"
              )}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={clsx("py-4 px-4 text-sm text-zinc-300", col.className)}
                >
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DFTable;

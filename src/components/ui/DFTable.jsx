import React from 'react';
import clsx from 'clsx';

const DFTable = ({
  headers = [],
  children,
  className = "",
  containerClassName = ""
}) => {
  return (
    <div className={clsx("overflow-x-auto", containerClassName)}>
      <table className={clsx("df-table", className)}>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="df-label !text-df-text-muted py-4 px-6 text-left border-b border-df-border-subtle"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default DFTable;

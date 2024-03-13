"use client"

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';

interface TableConfig {
  dimensions: string[];
  measures: string[];
}

interface DataRow {
  [key: string]: string | number;
}

const DynamicTable: React.FC<{ config: TableConfig; data: DataRow[] }> = ({
  config,
  data,
}) => {
  // Create columns from config
  const columns: ColumnDef<DataRow>[] = React.useMemo(
    () => [
      ...config.dimensions.map((dimension) => ({
        accessorKey: dimension, // Accessor is the "key" in the data
        header: dimension,
      })),
      ...config.measures.map((measure) => ({
        accessorKey: measure,
        header: measure,
      })),
    ],
    [config]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;

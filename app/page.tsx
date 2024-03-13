// In a file like pages/table.tsx

import React from 'react';
import DataTable from './datatable8';
import DynamicTable from './dynamictable';
import DynamicTablePage from './dynamic-table';

const TablePage = () => {
  const tableConfig = {
    dimensions: ['name', 'country'],
    measures: ['age'],
  };

  const data = [
    { name: 'John Doe', country: 'USA', age: 30 },
    { name: 'Jane Smith', country: 'UK', age: 25 },
    // more data...
  ];

  return (
    <div>
      <DataTable />
    </div>
  );
};

export default TablePage;

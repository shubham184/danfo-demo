"use client"

import React, { useEffect, useState } from 'react';
import * as dfd from 'danfojs';
import structure from '../public/data/simpleStructure.json';
import mockData from '../public/data/simpleData.json';

const DataTable: React.FC = () => {
  const [tableData, setTableData] = useState<Array<{ gender: string; count: number }>>([]);

  useEffect(() => {
    const df = new dfd.DataFrame(mockData);
    const dimension = structure.dataModel.dimensions[0].id; // 'esrs:GenderAxis'
    const measure = structure.dataModel.measures[1].id; // 'esrs:NumberOfEmployeesHeadcount'

    let groupedDf = df.groupby([dimension]);
    let aggregatedDf = groupedDf.agg({
        [measure]: "sum", // Ensure measure column exists and is numeric
      });
    //let jsonData = groupedDf.toJSON({ format: 'row' });
    console.log(aggregatedDf.toString);
    //let jsonData = dfd.toJSON(groupedDf, { format: 'column' }) as any[];
    //console.log(jsonData);

    // Transform jsonData to match the expected format for rendering
    // const transformedData = jsonData.map((row: any) => ({
    //   gender: row[dimension],
    //   count: row[`${measure}_sum`],
    // }));

    // console.log(transformedData);

    setProcessedData(aggregatedDf);
  }, []);

  const renderTable = () => {
    if (tableData.length === 0) return <p>Loading...</p>;

    return (
      <table>
        <thead>
          <tr>
            <th>Gender</th>
            <th>Number of Employees</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.gender}</td>
              <td>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return <div>{renderTable()}</div>;
};

export default DataTable;

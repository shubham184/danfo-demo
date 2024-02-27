"use client"

import React, { useEffect, useState } from 'react';
import * as dfd from 'danfojs';
import structure from '../public/data/simpleStructure.json';
import mockData from '../public/data/simpleData.json';

// Define a type for the table row data
interface TableRowData {
  gender: string;
  count: number;
}

const DataTable: React.FC = () => {
  // Separate states for total and average employee numbers
  const [totalEmployeeData, setTotalEmployeeData] = useState<Array<TableRowData>>([]);
  const [averageEmployeeData, setAverageEmployeeData] = useState<Array<TableRowData>>([]);

  useEffect(() => {
    const df = new dfd.DataFrame(mockData);
    const dimension = structure.dataModel.dimensions[0].id; // 'esrs:GenderAxis'

    // Process Total Number of Employees
    processMeasure(structure.dataModel.measures[0].id, setTotalEmployeeData);

    // Process Average Number of Employees
    // Assuming the second measure in your structure array is the average
    processMeasure(structure.dataModel.measures[1].id, setAverageEmployeeData);

    function processMeasure(measureId: string, setData: React.Dispatch<React.SetStateAction<TableRowData[]>>) {
      let groupedDf = df.groupby([dimension]).col([measureId]).sum();
      let jsonData = dfd.toJSON(groupedDf, { format: 'row' }) as any[]; // Corrected to 'row' for the expected structure
      console.log(jsonData);

      // Adjusted mapping to directly iterate over jsonData
      const transformedData = jsonData.map((row) => ({
        gender: row[dimension],
        count: row[`${measureId}_sum`], // Adjusted for the expected structure
      }));

      setData(transformedData);
    }
  }, []);

  const renderTable = (data: TableRowData[], measureLabel: string) => {
    if (data.length === 0) return <p>Loading {measureLabel}...</p>;

    return (
      <div>
        <h2>{measureLabel}</h2>
        <table>
          <thead>
            <tr>
              <th>Gender</th>
              <th>{measureLabel}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.gender}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      {renderTable(totalEmployeeData, "Total Number of Employees")}
      {renderTable(averageEmployeeData, "Average Number of Employees")}
    </div>
  );
};

export default DataTable;

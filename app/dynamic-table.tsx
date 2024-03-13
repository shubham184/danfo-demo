"use client"
import React, { useState } from 'react';
import * as dfd from "danfojs";

interface DataRow {
    [key: string]: string | number; // Allow any string key to map to string or number values
  }

  const allData: DataRow[] = [
    { name: 'John Doe', country: 'USA', age: 30 },
    { name: 'Jane Smith', country: 'UK', age: 25 },
    // more data...
  ];

const allFields = {
  dimensions: ['name', 'country'],
  measures: ['age'],
};

const DynamicTablePage = () => {
    const [data, setData] = useState<DataRow[]>([]);
    const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
    const [selectedMeasures, setSelectedMeasures] = useState<string[]>([]);

    

  // Handle change in selection
  const handleDimensionChange = (dimension: string) => {
    setSelectedDimensions((prev) =>
      prev.includes(dimension)
        ? prev.filter((d) => d !== dimension)
        : [...prev, dimension]
    );
  };

  const handleMeasureChange = (measure: string) => {
    setSelectedMeasures((prev) =>
      prev.includes(measure)
        ? prev.filter((m) => m !== measure)
        : [...prev, measure]
    );
  };

  return (
    <div>
      <div>
        <h2>Select Dimensions</h2>
        {allFields.dimensions.map((dimension) => (
          <div key={dimension}>
            <input
              type="checkbox"
              id={`dim-${dimension}`}
              name={dimension}
              checked={selectedDimensions.includes(dimension)}
              onChange={() => handleDimensionChange(dimension)}
            />
            <label htmlFor={`dim-${dimension}`}>{dimension}</label>
          </div>
        ))}

        <h2>Select Measures</h2>
        {allFields.measures.map((measure) => (
          <div key={measure}>
            <input
              type="checkbox"
              id={`mes-${measure}`}
              name={measure}
              checked={selectedMeasures.includes(measure)}
              onChange={() => handleMeasureChange(measure)}
            />
            <label htmlFor={`mes-${measure}`}>{measure}</label>
          </div>
        ))}
      </div>

      <div>
        <h2>Table</h2>
        <table>
          <thead>
            <tr>
              {selectedDimensions.concat(selectedMeasures).map((field) => (
                <th key={field}>{field}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allData.map((data, index) => (
              <tr key={index}>
                {selectedDimensions.concat(selectedMeasures).map((field) => (
                  <td key={`${field}-${index}`}>{data[field]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTablePage;

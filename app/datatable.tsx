"use client"
import React, { useEffect, useState } from 'react';
import * as dfd from 'danfojs';
import structure from '../public/data/simpleStructure.json';
import mockData from '../public/data/simpleData.json';

interface Dataframe {
  // Adjust according to actual usage
  [key: string]: any;
}

const DataTable: React.FC = () => {
  const [processedData, setProcessedData] = useState<dfd.DataFrame | null>(null);

  useEffect(() => {
    let df = new dfd.DataFrame(mockData);
    console.log(df);
    const dimension = structure.dataModel.dimensions[0].id; // Adjust based on your JSON structure
    const measure = structure.dataModel.measures[0].id;
    //console log dimension and measure
    console.log(dimension);
    console.log(measure);
    let groupedDf = df.groupby([dimension]);
    let aggregatedDf = groupedDf.agg({
        [measure]: "sum", // Ensure measure column exists and is numeric
      });
    console.log(aggregatedDf.toString()); // Debug output

    setProcessedData(aggregatedDf);
    //df = (df as any).groupby([dimension]).sum([measure]) as any;

    //setProcessedData(df);
  }, []);

  const renderTable = () => {
    if (!processedData) return <p>Loading...</p>;

    // Assuming `toJSON` correctly returns an array of objects
    const jsonData = dfd.toJSON(processedData, { format: 'column' }) as any[];
    // const genders = jsonData[dimension];
    // const counts = jsonData[`${measure}_sum`];

    if (!Array.isArray(jsonData)) {
        console.error('jsonData is not an array:', jsonData);
        return <p>Error: Data format is incorrect.</p>;
      }
    // Cast to any[] to ensure TypeScript knows it's an array

    return (

      <p></p>
      );
  };

  return <div>{renderTable()}</div>;
};

export default DataTable;

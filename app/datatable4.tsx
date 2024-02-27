"use client"
import React, { useEffect } from 'react';
import * as dfd from 'danfojs';
import structure from '../public/data/simpleStructure.json';
import mockData from '../public/data/simpleData.json';

const DataTable: React.FC = () => {
  useEffect(() => {
    const df = new dfd.DataFrame(mockData);
    const dimension = structure.dataModel.dimensions[0].id; // Assuming 'esrs:GenderAxis' or similar

    // Iterate over each measure defined in the structure
    structure.dataModel.measures.forEach(measure => {
      // Perform aggregation for each measure
      let groupedDf = df.groupby([dimension]).agg({[measure.id]: "sum"});
      console.log(`Table for ${measure.id}:`);
      console.log(groupedDf.toString());
      let jsonData = dfd.toJSON(groupedDf, { format: 'column' }) as any[]; // Corrected to 'row' for the expected structure
      console.log(`JSON Data for ${measure.id}:`, jsonData);
    });

  }, []);

  return <div>Check the console for aggregated data tables.</div>;
};

export default DataTable;

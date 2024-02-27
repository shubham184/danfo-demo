"use client"
import React, { useEffect } from 'react';
import * as dfd from 'danfojs';
import complexStructure from '../public/data/complexStructure.json';
import complexData from '../public/data/complexData.json';

const DataTable: React.FC = () => {
  useEffect(() => {
    const df = new dfd.DataFrame(complexData);
    const instructions = complexStructure.instructions.createTable;

    // Iterate over each measure specified in the instructions
    instructions.byMeasure.forEach(measureId => {
      const measure = complexStructure.dataModel.measures.find(m => m.id === measureId);
      if (!measure) return; // Skip if measure not found
      // Group by all dimensions specified in the instructions and aggregate by the current measure
      let groupedDf = df.groupby(instructions.byDimension).agg({[measureId]: "sum"});
      
      console.log(`Table for ${measureId}:`);
      console.log(groupedDf.toString());

      // Assuming JSON output is also desired
      let jsonData = dfd.toJSON(groupedDf, { format: 'row' });
      console.log(`JSON Data for ${measureId}:`, jsonData);
    });

  }, []);

  return <div>Check the console for aggregated data tables based on the complex structure.</div>;
};

export default DataTable;

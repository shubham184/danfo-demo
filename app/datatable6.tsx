"use client"
import React, { useEffect } from 'react';
import * as dfd from 'danfojs';
import structure from '../public/data/simpleStructure.json';
import mockData from '../public/data/simpleData.json';

const DataTable: React.FC = () => {
  useEffect(() => {
    const df = new dfd.DataFrame(mockData);
    const instructions = structure.instructions.createTables[0];

    instructions.measures.forEach(measureId => {
      const measure = structure.dataModel.measures.find(m => m.id === measureId);
      if (!measure) return; // Skip if measure not found

      // Use the aggregation type from the measure if specified
      const aggregationType = measure.aggregation || "sum"; // Fallback to sum if not specified
      let groupedDf = df.groupby([instructions.byDimension]).agg({[measureId]: aggregationType});
      
      console.log(`Table for ${measureId} (${aggregationType}):`);
      console.log(groupedDf.toString());

      // Assuming JSON output is also desired
      let jsonData = dfd.toJSON(groupedDf, { format: 'row' });
      console.log(`JSON Data for ${measureId}:`, jsonData);
    });

  }, []);

  return <div>Check the console for aggregated data tables.</div>;
};

export default DataTable;

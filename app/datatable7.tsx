"use client"
import React, { useEffect } from 'react';
import * as dfd from 'danfojs';
import complexStructure from '../public/data/complexStructure2.json';
import complexData from '../public/data/complexData2.json';

interface Totals {
  [key: string]: number;
}

const DataTable: React.FC = () => {
  useEffect(() => {
    const df = new dfd.DataFrame(complexData);
    const instructions = complexStructure.instructions.createTable;

    let totals: Totals = {};
    instructions.calculatePercentageFor.forEach(percentageMeasureId => {
      const calculationBase = percentageMeasureId.replace('PercentageOfEmployees', 'NumberOfEmployeesHeadCount');
      totals[calculationBase] = df[calculationBase].sum();
    });

    instructions.byMeasure.forEach(measureId => {
      // Assume existence check is done
      let groupedDf = df.groupby(instructions.byDimension).agg({[measureId]: "sum"});
      console.log(`Table for ${measureId}:`);
      console.log(groupedDf.toString());
    });

    // Handle calculation and display of percentages
    instructions.calculatePercentageFor.forEach(percentageMeasureId => {
      const measure = complexStructure.measures.find(m => m.id === percentageMeasureId);
      if (!measure || !measure.calculation) return;

      const baseMeasureId = measure.calculation.split('/')[0].trim();
      const total = totals[baseMeasureId];

      // Calculate percentages
      df[percentageMeasureId] = df[baseMeasureId].map((val: number) => (val / total) * 100);

      console.log(`Calculated ${measure.label}:`);
      console.log(df[percentageMeasureId].toString());
    });

  }, []);

  return <div>Check the console for aggregated data tables and calculated percentages based on the complex structure.</div>;
};

export default DataTable;



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
    const instructions = complexStructure.instructions.createTables[0]; // Assuming one set of instructions for simplicity

    // Iterate through each measure to create and process a table for that measure specifically
    instructions.byMeasure.forEach(measureId => {
      // Aggregate data based on the measure. Since we're focusing on one measure, we simplify aggregation.
      let groupedDf = df.groupby(instructions.byDimension).agg({[measureId]: "sum"});

      // Calculate percentages if this measure is in the calculatePercentageFor list and requires calculation
      if (instructions.calculatePercentageFor.includes(measureId)) {
        const measure = complexStructure.measures.find(m => m.id === measureId);
        if (measure && measure.isCalculated && measure.dataType === 'percent' && measure.baseMeasure) {
          // Here, you calculate the total for the base measure to use in percentage calculation
          // Assuming you have a totals object that tracks these sums or you calculate it on the fly
          const baseMeasureIdWithSum = `${measure.baseMeasure}_sum`;
          const total = df[measure.baseMeasure].sum(); // Calculate the total sum for the base measure across the entire DataFrame

          if (total > 0) {
            // Calculate and add the percentage column based on this measure
            groupedDf.addColumn(`${measureId}_percent`, groupedDf[measureId].div(total).mul(100), { inplace: true });
            console.log(`Calculated percentage for ${measureId}:`);
            console.log(groupedDf[`${measureId}_percent`].toString());
          } else {
            console.warn(`Total for ${measure.baseMeasure} is zero, cannot calculate percentage.`);
          }
        }
      }

      // Log the table for the current measure
      console.log(`Table for measure ${measureId}:`);
      console.log(groupedDf.toString());
    });
  }, []);

  return <div>Check the console for separated aggregated data tables for each measure.</div>;
};

export default DataTable;




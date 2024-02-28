"use client"
import React, { useEffect } from 'react';
import * as dfd from 'danfojs';
import complexStructure from '../public/data/complexStructure2.json';
import complexData from '../public/data/complexData2.json';

interface Totals {
  [key: string]: number;
}

const DataTable: React.FC = () => {
  console.log('********start*******');
  useEffect(() => {
    const df = new dfd.DataFrame(complexData);
    const instructions = complexStructure.instructions.createTable;

    let totals: Totals = {};
    instructions.calculatePercentageFor.forEach(percentageMeasureId => {
      const measure = complexStructure.measures.find(m => m.id === percentageMeasureId);
      if (!measure || !measure.isCalculated || !measure.baseMeasure) return;
      
      const baseMeasureId = measure.baseMeasure;
      totals[baseMeasureId] = df[baseMeasureId].sum();
      const total = totals[baseMeasureId];
      if(measure.isCalculated && measure.dataType === 'percent') {
        if (total > 0) {
          df[percentageMeasureId] = df[baseMeasureId].div(total).mul(100);
          console.log(`Calculated ${measure.label}:`);
          console.log(df[percentageMeasureId].toString());
          // let groupedDf = df.groupby(instructions.byDimension).agg({[baseMeasureId]: "sum"});
          // let percentageDf = groupedDf[baseMeasureId].div(total).mul(100);
          // groupedDf.addColumn(percentageMeasureId, percentageDf);
          // console.log(`Table for ${percentageMeasureId}:`);
          // console.log(groupedDf.toString());
        }
        else {
          console.warn(`Total for ${baseMeasureId} is zero, cannot calculate percentage.`);
        }
      }
    });

    instructions.byMeasure.forEach(measureId => {
      let groupedDf = df.groupby(instructions.byDimension).agg({[measureId]: "sum"});
      console.log(`Table for ${measureId}:`);
      console.log(groupedDf.toString());
    });

  }, []);

  return <div>Check the console for aggregated data tables and calculated percentages based on the complex structure.</div>;
};

export default DataTable;



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

    complexStructure.instructions.createTables.forEach((tableInstruction: any) => {
      const { byDimension, byMeasure, calculatePercentageFor, splitByDimension } = tableInstruction;
      
      // If there's a dimension specified to split by, get the unique values for that dimension
      if (splitByDimension) {
        const uniqueValues = df[splitByDimension].unique().values;

        uniqueValues.forEach((value: any) => {
          // Filter the DataFrame for each unique value in the split dimension
          let condition = df[splitByDimension].eq(value);
          let filteredDf = df.loc({rows: condition});


          processDf(filteredDf, byDimension, byMeasure, calculatePercentageFor, splitByDimension, value);
        });
      } else {
        // Process the entire DataFrame without splitting
        processDf(df, byDimension, byMeasure, calculatePercentageFor);
      }
    });
  }, []);

  return <div>Check the console for output</div>;
};

function processDf(df: any, byDimension: string[], byMeasure: string[], calculatePercentageFor: string[], splitByDimension?: string, splitValue?: string) {
  let groupedDf = df.groupby(byDimension).agg(byMeasure.reduce((acc: any, cur: string) => ({ ...acc, [cur]: "sum" }), {}));

  calculatePercentageFor.forEach((percentageMeasureId: string) => {
    const measure = complexStructure.measures.find((m: any) => m.id === percentageMeasureId);
    if (!measure || !measure.isCalculated || measure.dataType !== 'percent') return;

    const baseMeasureIdWithSum = `${measure.baseMeasure}_sum`;
    let percentageColumn = groupedDf[baseMeasureIdWithSum].div(groupedDf[baseMeasureIdWithSum].sum()).mul(100);
    groupedDf.addColumn(percentageMeasureId, percentageColumn, { inplace: true });
  });

  if (splitByDimension && splitValue) {
    console.log(`Table for ${splitByDimension} = ${splitValue}:`);
  } else {
    console.log('Aggregated Table:');
  }
  console.log(groupedDf.toString());
}

export default DataTable;



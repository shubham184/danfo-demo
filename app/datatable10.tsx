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

    complexStructure.instructions.createTables.forEach(tableInstruction => {
      const { byDimension, byMeasure, calculatePercentageFor } = tableInstruction;
      
      // Handle groupings and aggregations based on provided dimensions and measures
      let groupedDf = df.groupby(byDimension).agg(byMeasure.reduce((acc, cur) => ({ ...acc, [cur]: "sum" }), {}));
      //let groupedDf = df.groupby(byDimension).agg({[baseMeasureId]: "sum"}); 
      // Calculate percentages if needed
      //console log groupedDf in string format separated by commas
      //console.log(`groupeddf for byMeasure ${groupedDf.transpose()}`);
      calculatePercentageFor.forEach(percentageMeasureId => {
        const measure = complexStructure.measures.find(m => m.id === percentageMeasureId);
        if (!measure || !measure.isCalculated || measure.dataType !== 'percent') return;

        const baseMeasureId = measure.baseMeasure;
        const baseMeasureIdWithSum = `${measure.baseMeasure}_sum`;
        let percentageColumn = groupedDf[baseMeasureIdWithSum].div(groupedDf[baseMeasureIdWithSum].sum()).mul(100);
        groupedDf.addColumn(percentageMeasureId, percentageColumn, { inplace: true });
        //console.log(`groupeddf for baseMeasureID ${df[baseMeasureId].toString()}`);
        //const total = groupedDf[baseMeasureIdWithSum].sum(); // Ensure this logic correctly fetches totals per group
        
        // if (total > 0) {
        //   groupedDf[percentageMeasureId] = groupedDf[baseMeasureIdWithSum].div(total).mul(100);
        //   console.log(`Calculated ${measure.label}:`);
        //   console.log(groupedDf[percentageMeasureId].toString());
        // } else {
        //   console.warn(`Total for ${baseMeasureId} is zero, cannot calculate percentage.`);
        // }
      });

      console.log(`Table for dimensions ${byDimension.join(", ")}:`);
      console.log(groupedDf.toString());
      groupedDf.plot("plot_div").table();
      
      const headerStyle = {
        align: "center",
        fill: { color: ['gray'] },
        font: { family: "Arial", size: 15, color: "white" },
        
      }
      const cellStyle = {
        align: ["center"],
        line: { color: "black", width: 10 }
      }

      groupedDf.plot("plot_div").table({
        // config: {
        //   tableHeaderStyle: headerStyle,
        //   tableCellStyle: cellStyle
        // },
        layout: {
          title: "Table displaying the Titanic dataset",
        }
      })
      const jsonObj = dfd.toJSON(groupedDf); //column format
      console.log(jsonObj);
    });
  }, []);

  
  return (
    <div className="App">
      <header className="App-header">
        <div id="plot_div"></div>
      </header>
    </div>
  );
};

export default DataTable;



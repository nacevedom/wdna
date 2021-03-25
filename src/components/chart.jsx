import React from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
  chart: {
    type: "spline",
  },
  title: {
    text: "My chart",
  },
  series: [
    {
      name: "Enero",
      data: [1, 2, 1, 4, 3, 6],
    },
    {
      name: "Febrero",
      data: [1, 3, 3, 1, 4, 6],
    },
  ],
};

const Chart = () => (
  <div>
    <HighchartsReact highcharts={Highcharts} options={options} />
  </div>
);

export default Chart;

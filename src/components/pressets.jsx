import React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

class Options extends React.Component {
  options = {
    title: {
      text: "My chart",
    },
    series: [
      {
        type: "column",
        data: [1, 2, 3],
      },
    ],
  };
}

export default Options;

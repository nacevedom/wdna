import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      temperatures: [],
      dates: [],
      result: [],
      datas: [
        {
          name: "2021-05-29",

          y: 30,
          datetime: new Date("2021-05-29"),
        },
        {
          name: "2021-05-29",

          y: 24,
          datetime: new Date("2021-05-29"),
        },
        {
          name: "2021-05-30",

          y: 10,
          datetime: new Date("2021-05-30"),
        },
        {
          name: "2021-05-30",

          y: 33,
          datetime: new Date("2021-05-30"),
        },
        {
          name: "2021-05-31",

          y: 37,
          datetime: new Date("2021-05-31"),
        },
      ],
      datas2: [
        {
          name: "2021-05-29",

          y: 15,
          datetime: new Date("2021-05-29"),
        },
        {
          name: "2021-05-29",

          y: 29,
          datetime: new Date("2021-05-29"),
        },
        {
          name: "2021-05-30",

          y: 8,
          datetime: new Date("2021-05-30"),
        },
        {
          name: "2021-05-30",

          y: 30,
          datetime: new Date("2021-05-30"),
        },
        {
          name: "2021-05-31",

          y: 40,
          datetime: new Date("2021-05-31"),
        },
      ],
      chart: {
        type: "line",
      },
      title: {
        text: "My chart",
      },
      series: [
        {
          data: [],

          color: "black",
        },
        {
          data: [],
          color: "red",
        },
      ],
      // xAxis: [
      //   {
      //     dateTimeLabelFormats: {
      //       day: "%d %b %Y",
      //     },
      //     type: "datetime",
      //     labels: {
      //       rotation: -45,
      //       //Specify the formatting of xAxis labels:
      //       format: "{value:%Y-%m-%d }",
      //     },
      //   },
      // ],

      credits: {
        enabled: false,
      },
    };
  }

  componentDidMount() {
    this.insertData();
  }

  handleChange = (e) => {
    this.setState({
      name: e.target.value,
    });

    this.filterTemp(e.target.value);
  };

  // handleChangeTime = (date1, date2) => {
  //   var dateFormat = require("dateformat");
  //   if (date1 || date2) {
  //     var datetime = dateFormat(date1, "dd-mm-yyyy");
  //     this.setState({
  //       series: [
  //         {
  //           data: this.state.datas.filter(function (n) {
  //             return n.datetime >= datetime;
  //           }),
  //         },
  //       ],
  //     });
  //     console.log(date1, date2);
  //   } else {
  //     console.log("hola");
  //   }
  // };

  insertData = () => {
    fetch(
      "http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/owner/historical?id=1&start=2021-03-30%2013:00:00&end=2021-03-30%2013:00:00"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var temperatures = [];

        var dateFormat = require("dateformat");
        data.forEach((item) => {
          temperatures.push({
            name: dateFormat(item.datetime, "dd-mm-yyyy"),
            date: item.datetime,
            y: item.temperature,
          });
        });

        this.setState({
          result: data,
          series: [
            {
              data: temperatures,
            },
            // {
            //   data: this.state.datas2,
            // },
          ],
          // xAxis: [
          //   {
          //     categories: (function getDates() {
          //       var dateFormat = require("dateformat");

          //       this.state.datas2.forEach((item) => {
          //         dates = dateFormat(item.datetime, "dd-mm-yyyy");
          //       });

          //       return dates;
          //     })(),
          //   },
          // ],
          temperatures: temperatures,
        });
      });
  };
  // daterange = () => {
  //   if (this.state.startDate) {
  //     this.setState({
  //       series: [
  //         {
  //           data: this.state.datas.filter(function (n) {
  //             return (n.datetime = this.state.startDate);
  //           }),
  //         },
  //       ],
  //     });
  //   } else {
  //     console.log(this.state.dates);
  //     return false;
  //   }
  // };
  filterTemp = (name) => {
    this.setState({
      series: [
        {
          data: this.state.temperatures.filter((n) => n.y >= name),
        },
        // {
        //   data: this.state.datas2.filter((n) => n.y >= name),
        // },
      ],
    });
  };

  render() {
    const { temperatures, startDate, endDate } = this.state;

    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={this.state} />
        <input
          onChange={this.handleChange}
          className="form-control"
          type="text"
          name="name"
          id="field"
        />

        <DatePicker
          name="startdate"
          dateFormat="yyyy-MM-dd"
          selected={startDate}
          onChange={(date) => {
            this.setState({
              startDate: date,
            });

            if (date) {
              this.setState({
                series: [
                  {
                    data: temperatures.filter(function (n) {
                      var datetime = new Date(n.date);

                      var a = datetime >= date;

                      return a;
                    }),
                  },
                  // {
                  //   data: datas2.filter(function (n) {
                  //     var b = n.datetime >= date;
                  //     return b;
                  //   }),
                  // },
                ],
              });
            } else {
              return alert("No existe ninguna fecha de entrada");
            }
          }}
          startDate={startDate}
          endDate={endDate}
        />
        <DatePicker
          name="enddate"
          dateFormat="yyyy-MM-dd"
          selected={endDate}
          onChange={(date) => {
            this.setState({
              endDate: date,
            });

            if (date && startDate) {
              this.setState({
                series: [
                  {
                    data: temperatures.filter(function (n) {
                      var datetime = new Date(n.date);

                      var a = datetime >= startDate && datetime <= date;
                      // console.log(datein);

                      return a;
                    }),
                  },
                  // {
                  //   data: datas2.filter(function (n) {
                  //     var b = n.datetime < date;
                  //     return b;
                  //   }),
                  // },
                ],
              });
            } else {
              return alert("No existe ninguna fecha de entrada");
            }
          }}
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
      </div>
    );
  }
}

export default Chart;

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import DatePicker from "react-datepicker";
import moment from "moment";

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
          name: "temperatura",
          y: 30,
          datetime: "29-05-2021",
        },
        {
          name: "temperatura",
          y: 24,
          datetime: "29-05-2021",
        },
        {
          name: "temperatura",
          y: 10,
          datetime: "30-05-2021",
        },
        {
          name: "temperatura",
          y: 33,
          datetime: "30-05-2021",
        },
        {
          name: "temperatura",
          y: 37,
          datetime: "31-05-2021",
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
      ],
      xAxis: [
        {
          categories: [],
        },
      ],

      credits: {
        enabled: false,
      },
    };
  }

  handler = (data) => {
    this.setState({ saludo: data });
    console.log(this.state.saludo);
  };
  componentDidMount() {
    this.insertData();
  }

  handleChange = (e) => {
    this.setState({
      name: e.target.value,
    });

    this.filterTemp(e.target.value);
  };
  handleChange2 = (e) => {
    this.setState({
      startDate: e.target.value,
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
        // var dates = [];
        // var categories = [];
        // var dateFormat = require("dateformat");
        // data.forEach((item, index) => {
        //   temperatures.push({
        //     name: dateFormat(item.datetime, "dd-mm-yyyy"),
        //     x: index,
        //     y: item.temperature,
        //   });
        // });
        // console.log(temperatures);

        this.setState({
          result: data,
          series: [
            {
              data: this.state.datas,
            },
          ],
          temperatures: temperatures,

          // xAxis: [
          //   {
          //     categories: (function getResult() {
          //       var dateFormat = require("dateformat");

          //       data.forEach((item) => {
          //         dates.push(dateFormat(item.datetime, "dd-mm-yyyy"));
          //       });

          //       return dates;
          //     })(),
          //   },
          // ],
        });
      });
  };
  daterange = () => {
    if (this.state.startDate) {
      this.setState({
        series: [
          {
            data: this.state.datas.filter(function (n) {
              return (n.datetime = this.state.startDate);
            }),
          },
        ],
      });
    } else {
      console.log(this.state.dates);
      return false;
    }
  };
  filterTemp = (name) => {
    this.setState({
      series: [
        {
          data: this.state.datas.filter((n) => n.y >= name),
        },
      ],
    });
  };

  render() {
    const { datas, startDate, endDate } = this.state;

    // var dateFormat = require("dateformat");
    // var datetime = dateFormat(date, "dd-mm-yyyy");
    //       if (startDate) {
    //         this.setState({
    //           series: [
    //             {
    //               data: datas.filter(function (n) {
    //                 return (n.datetime = datetime);
    //               }),
    //             },
    //           ],
    //         });
    //       } else {
    //         console.log(this.state.dates);
    //         return false;
    //       }

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
          dateFormat="dd-MM-yyyy"
          selected={startDate}
          onChange={(date) => {
            this.setState({
              startDate: date,
            });
            console.log(date);
            if (date) {
              var dateStart = moment(date).format("DD-MM-YYYY");
              this.setState({
                series: [
                  {
                    data: datas.filter(function (n) {
                      var a = n.datetime >= dateStart;

                      console.log(a);
                      return a;
                    }),
                  },
                ],
              });
            } else {
              return alert("No existe ninguna fecha de entrada");
            }
            // if (date && endDate) {
            //   var datetime = moment(date).format("DD-MM-YYYY");
            //   var datetime2 = moment(endDate).format("DD-MM-YYYY");
            //   this.setState({
            //     series: [
            //       {
            //         data: this.state.datas.filter(function (n) {
            //           var a = n.datetime >= datetime;
            //           var b = n.datetime < datetime2;
            //           console.log(a && b);
            //           return a && b;
            //         }),
            //       },
            //     ],
            //   });
            // } else {
            //   console.log("hola");
            // }
          }}
          startDate={startDate}
          endDate={endDate}
        />
        <DatePicker
          name="enddate"
          dateFormat="dd-MM-yyyy"
          selected={endDate}
          onChange={(date) => {
            this.setState({
              endDate: date,
            });
            if (date) {
              var dateEnd = moment(date).format("DD-MM-YYYY");
              this.setState({
                series: [
                  {
                    data: datas.filter(function (n) {
                      var a = n.datetime < dateEnd;

                      console.log(a);
                      return a;
                    }),
                  },
                ],
              });
            } else {
              return alert("No existe ninguna fecha de entrada");
            }
            // if (startDate && date) {
            //   var datetime = moment(startDate).format("DD-MM-YYYY");
            //   var datetime2 = moment(date).format("DD-MM-YYYY");
            //   this.setState({
            //     series: [
            //       {
            //         data: this.state.datas.filter(function (n) {
            //           var a = n.datetime >= datetime;
            //           var b = n.datetime < datetime2;
            //           console.log(a && b);
            //           return a && b;
            //         }),
            //       },
            //     ],
            //   });
            // } else {
            //   console.log("hola");
            // }
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

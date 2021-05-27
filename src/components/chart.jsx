import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Switch from "react-switch";

class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      _isMounted: false,
      temperatures: [],
      dates: [],
      result: [],
      checked: false,
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
      credits: {
        enabled: false,
      },
    };
    this.handleChangeSwitch = this.handleChangeSwitch.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.state.checked) {
      setInterval(() => {
        alert("alert");
      }, 8000);
    }
    this.insertData();
  }

  componentWillMount() {
    this._isMounted = false;
  }
  handleChange = (e) => {
    this.setState({
      name: e.target.value,
    });

    this.filterTemp(e.target.value);
  };

  handleChangeSwitch = (checked) => {
    this.setState({
      checked: checked,
    });
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

  insertData = async () => {
    var dateFormat = require("dateformat");
    var date = new Date();

    var subs = moment().subtract(3, "hours");
    var minute = subs.minutes();

    var startdate = subs.subtract(minute, "minutes").format("YYYY-MM-DDTHH:mm");

    var enddate = dateFormat(date, "isoDateTime");

    try {
      const data = await axios.get(
        `http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/owner/historical?id=1&start=${startdate}&end=${enddate}`
      );

      const data2 = await axios.get(
        "http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/listallwithinfo?id=1"
      );

      var a = [];

      data2.data.forEach((item) => {
        if (item.state === "Comunidad Valenciana") {
          a.push(item.unique_id);
        }
      });

      var temperatures = [];

      for (let i = 0; i <= a.length; i++) {
        data.data.forEach((item) => {
          if (item.id === a[i]) {
            temperatures.push({
              name: dateFormat(item.datetime, "dd-mm-yyyy"),
              date: item.datetime,
              y: item.temperature,
            });
          }
        });
      }

      this.setState({
        result: data,
        series: [
          {
            data: temperatures,
          },
        ],
        temperatures: temperatures,
      });
    } catch (e) {
      console.log(e);
    }
  };
  // };
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
    const { temperatures, startDate, endDate, checked } = this.state;
    console.log(this.state.checked);

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
        <label>
          <span>Switch with default style</span>
          <Switch onChange={this.handleChangeSwitch} checked={checked} />
        </label>
      </div>
    );
  }
}

export default Chart;

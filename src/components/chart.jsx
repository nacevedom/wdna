import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class Chart extends React.Component {
  static contextType = {
    updateParent: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date(),
      datetime: new Date(),
      temperatures: [],
      dates: [],

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

          x: "April",
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

  handleChangeTime = (e) => {
    this.setState({
      name: e.target.value,
    });

    this.filterTemp(e.target.value);
  };

  insertData = () => {
    fetch(
      "http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/owner/historical?id=1&start=2021-03-30%2013:00:00&end=2021-03-30%2013:00:00"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var result = [];
        var categories = [];

        this.setState({
          series: [
            {
              data: (function getResult() {
                data.forEach((item) => {
                  result.push(item.temperature);
                });
                return result;
              })(),
            },
          ],
          temperatures: result,
          xAxis: [
            {
              categories: (function getResult() {
                var dateFormat = require("dateformat");

                data.forEach((item) => {
                  categories.push(dateFormat(item.datetime, "dd-mmm-yyyy"));
                });

                return categories;
              })(),
            },
          ],
          dates: categories,
        });
      });
  };

  filterTemp = (name) => {
    this.setState({
      series: [
        {
          data: this.state.array.filter((n) => n >= name),
        },
      ],
    });
  };

  render() {
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
        <label> {this.state.saludo}</label>
        <DatePicker
          dateFormat="yyyy-MMM-dd"
          selected={this.state.startDate}
          onChange={(date) => {
            var dateFormat = require("dateformat");
            var datetime = dateFormat(date, "yyyy-mmm-dd");
            this.setState({
              startDate: date,
              datetime: datetime,
            });
            console.log(datetime);
          }}
        />
      </div>
    );
  }
}

export default Chart;
